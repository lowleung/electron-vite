const path = require("path");
const fs = require("fs");
const crypto = require("node:crypto");

const {
  sortDependencies,
  installDependencies,
  printMessage,
} = require("./utils");

function createRsa() {
  const cryptoKeyPairOptions = {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
    },
  };
  const { publicKey, privateKey } = crypto.generateKeyPairSync(
    "rsa",
    cryptoKeyPairOptions
  );
  return { publicKey, privateKey };
}

module.exports = {
  prompts: {
    name: {
      type: "string",
      required: true,
      message: "项目名",
    },
    description: {
      type: "string",
      required: true,
      message: "项目简介",
      default: "A Electron project",
    },
    rsa: {
      type: "confirm",
      required: true,
      message: "Create Rsa File?",
      default: true,
    },
    autoInstall: {
      type: "list",
      message:
        "Should we run `npm install` for you after the project has been created? (recommended)",
      choices: [
        {
          name: "Yes, use NPM",
          value: "npm",
          short: "npm",
        },
        {
          name: "Yes, use Yarn",
          value: "yarn",
          short: "yarn",
        },
        {
          name: "No, I will handle that myself",
          value: false,
          short: "no",
        },
      ],
    },
  },

  filters: {
    "build/createLicence.js": "rsa",
    "build/private.key": "rsa",
    "build/public.key": "rsa",
    "src/main/getHardwaveId.js": "rsa",
    "src/main/validateLicense.js": "rsa",
  },

  complete: function (data, { chalk }) {
    const green = chalk.green;
    if (data.rsa) {
      const rsa_data = createRsa();
      data.publicKey = rsa_data.publicKey;
      data.privateKey = rsa_data.privateKey;
      fs.writeFileSync(
        path.join(data.destDirName, "build", "public.key"),
        rsa_data.publicKey
      );
      fs.writeFileSync(
        path.join(data.destDirName, "build", "private.key"),
        rsa_data.privateKey
      );
    }
    sortDependencies(data, green);

    const cwd = path.join(process.cwd(), data.inPlace ? "" : data.destDirName);
    if (data.autoInstall) {
      installDependencies(cwd, data.autoInstall, green)
        .then(() => {
          printMessage(data, green);
        })
        .catch((e) => {
          console.log(chalk.red("Error:"), e);
        });
    } else {
      printMessage(data, chalk);
    }
  },
};

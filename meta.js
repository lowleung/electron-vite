const path = require("path");
const fs = require("fs");

const {
  sortDependencies,
  installDependencies,
  printMessage,
} = require("./utils");

const { addTestAnswers } = require("./scenarios");

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
  metalsmith: {
    before: addTestAnswers,
  },

  prompts: {
    name: {
      when: "isNotTest",
      type: "string",
      required: true,
      message: "Project name",
    },
    description: {
      when: "isNotTest",
      type: "string",
      required: false,
      message: "Project description",
      default: "A Vue.js project",
    },
    rsa: {
      when: "isNotTest",
      type: "confirm",
      message: "Create Rsa File?",
    },
    autoInstall: {
      when: "isNotTest",
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
          name: "Yes, use Pnpm",
          value: "pnpm",
          short: "pnpm",
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
    'build/createLicence.js': 'rsa',
  },
  complete: function (data, { chalk }) {
    const green = chalk.green;
    if (data.rsa) {
      const rsa_data = createRsa();
      fs.writeFileSync("public.key", rsa_data.publicKey);
      fs.writeFileSync("private.key", rsa_data.privateKey);
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

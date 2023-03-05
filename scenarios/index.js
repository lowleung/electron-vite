const index = scenarios.indexOf(process.env.VUE_TEMPL_TEST);

const isTest = (exports.isTest = index !== -1);

const scenario = {
  name: "",
  description: "",
  autoInstall: false,
};

exports.addTestAnswers = (metalsmith, options, helpers) => {
  Object.assign(
    metalsmith.metadata(),
    { isNotTest: !isTest },
    isTest ? scenario : {}
  );
};

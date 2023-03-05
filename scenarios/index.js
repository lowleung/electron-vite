const scenario = {
  name: "",
  description: "",
  autoInstall: false,
};

exports.addTestAnswers = (metalsmith, options, helpers) => {
  Object.assign(
    metalsmith.metadata(),
    { isNotTest: true},
     scenario 
  );
};

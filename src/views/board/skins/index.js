import camelCase from 'lodash/camelCase';
import upperFirst from 'lodash/upperFirst';

const requireModule = require.context('.', true, /(Form|List|Read)\.vue$/, 'lazy');
const modules = {};

requireModule.keys().forEach(filename => {
		const moduleName = upperFirst(camelCase(filename.replace(/(\.\/|\.vue)/g, '')));
		modules[moduleName] = () => requireModule(filename);
});

// console.log(modules);

export default modules;
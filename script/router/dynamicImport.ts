const dynamicImport = (module: string) => {
	delete require.cache[module];

	return require(module).default;
};

export default dynamicImport;

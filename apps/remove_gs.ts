const { spawn } = require("child_process");


const removeGS = (imgName: string) => {
	const processPy = spawn("python", ["./py/remove_gs.py", imgName]);
	processPy.stdout.on("data", (data: Buffer) => {
		const readableData = data.toString();
		console.log(readableData);
	});
	processPy.on("close", (code: number) => {
		if(code) console.log(`FINISHED REMOVING GREEN SCREEN FROM ${imgName}`);
	});
}


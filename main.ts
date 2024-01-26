
const dir = Deno.args[0];

if (!dir) {
    console.error("Invalid cli usage. Must supply a path to place the generated md file.")
}

console.log(dir);
let md = `# 3020 Excersises List 
Generated On: ${new Date().toDateString()} ${new Date().toTimeString().split(" ")[0]}
Completed $COMPLETED of $TOTAL excersises.\n\n`;

let count = 0;
let totalCompleted = 0;

for await (const dirEntry of Deno.readDir('./')) {
    if (dirEntry.name !== ".vscode" && dirEntry.isDirectory) {
        ++count;
        const name = dirEntry.name.replaceAll("-tlaceby", "");
        let completed = false;
        
        for await (const children of Deno.readDir(dirEntry.name)) {
            if (children.isFile && children.name === ".done") {
                completed = true;
                totalCompleted ++;
                break;
            }
        }
        
        if (completed) {
            md += `- [x] ${name}\n`;
        } else {
            md += `- [ ] ${name}\n`;
        }
        
    }
}

md = md.replaceAll("$COMPLETED", totalCompleted.toString());
md = md.replaceAll("$TOTAL", count.toString());
Deno.writeTextFileSync(dir + "completed.md", md);
import express from "express"
import { cwd } from "node:process"

const app = express();
app.set("views", cwd() + "/view")
app.use(express.static('../public'))
const port = 3000;
app.get("/", (req, res) => {
	res.sendFile(cwd() + "/view/index.html");
});

app.listen(port, () => {
	console.log("App running on https://localhost:" + port);
});

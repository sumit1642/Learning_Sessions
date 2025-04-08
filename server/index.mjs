import express from "express";
import session from "express-session";
import cors from "cors";

const app = express();
const GATEWAY_PORT = 8000;

// Temporary memory
const loginData = [];

app.use(express.json());

app.use(
	session({
		secret: "stupidsecret",
		resave: false,
		saveUninitialized: true,
		cookie: { secure: false },
	}),
);

// Allow frontend to connect backend
app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true,
	}),
);

app.post("/signup", (req, res) => {
	const { username, password } = req.body;
	const exists = loginData.find((item) => item.username == username);
	if (exists) {
		return res.status(400).json({ msg: "User already exists" });
	}
	loginData.push({ username, password });
	req.session.account = { username };
	res.json({ msg: "Signup successful", account: req.session.account });
});

app.post("/login", (req, res) => {
	const { username, password } = req.body;
	const match = loginData.find(
		(item) => item.username == username && item.password == password,
	);

	if (!match) {
		return res.status(401).json({ msg: "Invalid credentials" });
	}

	req.session.account = { username };
	res.json({ msg: "login sucessfull", account: req.session.account });
});

app.get("/me", (req, res) => {
	if (req.session.account) {
		res.json({ account: req.session.account });
	} else {
		res.status(404).json({ msg: "not logged in" });
	}
});

app.post("/logout", (req, res) => {
	req.session.destroy(() => res.json({ msg: "session destroyed" }));
});

app.listen(GATEWAY_PORT);

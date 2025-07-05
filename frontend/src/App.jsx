import { useState, useRef } from "react";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import SendIcon from "@mui/icons-material/Send";
import ConstructionIcon from "@mui/icons-material/Construction";
import IconButton from "@mui/material/IconButton";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import "./App.css";

const API_HOST = import.meta.env.VITE_API_HOST || "http://localhost:3000";

function App() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [files, setFiles] = useState([]);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef();

  const handleSend = async () => {
    if (!input.trim()) {
      setError("Please enter some context.");
      return;
    }
    setLoading(true);
    setError("");
    setTimer(0);
    timerRef.current = setInterval(() => {
      setTimer((t) => t + 1);
    }, 1000);
    try {
      const response = await fetch(`${API_HOST}/api/v1/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });
      if (!response.ok) throw new Error("Request failed");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const now = new Date();
      const label = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setFiles((prev) => [{ url, name: label }, ...prev]);
    } catch (e) {
      console.error(e);
      setError("An error occurred while generating the PDF. Please try again.");
    } finally {
      setLoading(false);
      clearInterval(timerRef.current);
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography variant="h3" align="center" sx={{ mb: 4, fontWeight: 700 }}>
          SlideForge <ConstructionIcon fontSize="large" />
        </Typography>
        <Container>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => {}}>
              {error}
            </Alert>
          )}
          <Card>
            <CardContent>
              <Typography
                gutterBottom
                sx={{ color: "text.primary", fontSize: 14 }}
              >
                Enter your context bellow:
              </Typography>
              <div
                style={{ display: "flex", flexDirection: "row", gap: "1rem" }}
              >
                <TextField
                  fullWidth
                  multiline
                  minRows={1}
                  maxRows={8}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                />
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "column",
                      gap: "0.5rem",
                    }}
                  >
                    <IconButton
                      color="primary"
                      onClick={handleSend}
                      disabled={loading}
                      loading={loading}
                    >
                      <SendIcon />
                    </IconButton>
                    {timer > 0 && (
                      <Typography
                        variant="caption"
                        style={{ userSelect: "none" }}
                      >
                        {timer}s
                      </Typography>
                    )}
                  </div>
                </div>
              </div>
              {/* Downloaded files buttons */}
              {files.length > 0 && (
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginTop: "1rem",
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      style={{ marginRight: "0.5rem" }}
                    >
                      Results:
                    </Typography>
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        flexWrap: "wrap",
                      }}
                    >
                      {files.map((file) => (
                        <Button
                          key={file.url}
                          variant="outlined"
                          color="secondary"
                          onClick={() => window.open(file.url, "_blank")}
                          size="small"
                        >
                          {file.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </Container>
      </div>
    </>
  );
}

export default App;

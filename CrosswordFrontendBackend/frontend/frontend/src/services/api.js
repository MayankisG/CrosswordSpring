const API_BASE_URL = "http://localhost:8080/api/crossword";

export const api = {
  getRandomCrossword: async () => {
    const response = await fetch(`${API_BASE_URL}/random`);
    return response.text();
  },

  getRandomCrosswordWithWords: async () => {
    const response = await fetch(`${API_BASE_URL}/random/details`);
    return response.json();
  },

  getRandomCrosswordWithClues: async () => {
    const response = await fetch(`${API_BASE_URL}/random/clues`);
    return response.json();
  },

  subscribeToSolverSteps: (onUpdate) => {
    console.log("[SSE] Connecting to solver steps...");
    const eventSource = new EventSource(`${API_BASE_URL}/solve/steps`);

    eventSource.addEventListener("solver-update", (event) => {
      try {
        console.log("[SSE] Received update:", event.data);
        const data = JSON.parse(event.data);

        // Convert grid to frontend format (empty strings for empty cells)
        const parsedGrid = data.grid.map((row) =>
          typeof row === "string"
            ? row.split("").map((cell) => (cell === "-" ? "" : cell))
            : row.map((cell) => (cell === "-" ? "" : cell))
        );

        onUpdate({
          ...data,
          grid: parsedGrid,
        });

        if (data.action === "solved") {
          console.log("[SSE] Puzzle solved, closing connection");
          eventSource.close();
        }
      } catch (error) {
        console.error("[SSE] Error parsing event data:", error);
      }
    });

    eventSource.onerror = (error) => {
      console.error("[SSE] Error:", error);
      if (eventSource.readyState === EventSource.CLOSED) {
        console.log("[SSE] Connection was closed");
      }
      eventSource.close();
    };

    return () => {
      console.log("[SSE] Closing connection");
      eventSource.close();
    };
  },
};

// utils.js — Fixed & Secure

// Note: API_KEY removed or handled securely. Mock/test placeholder removed.

function calculateAverage(numbers) {
    if (!Array.isArray(numbers) || numbers.length === 0) {
        return 0;
    }

    let total = 0;
    for (let i = 0; i < numbers.length; i++) {
        total += numbers[i];
    }

    return total / numbers.length;
}

function formatUser(user) {
    if (!user || !user.name || !user.email) {
        return "";
    }
    return user.name.toUpperCase() + " - " + user.email;
}

function parseUserData(jsonString) {
    try {
        const data = JSON.parse(jsonString);
        return data?.user?.profile?.name || null;
    } catch (e) {
        return null;
    }
}

async function fetchUser(userId) {
    const response = await fetch(
        "https://jsonplaceholder.typicode.com/users/" + userId
    );

    if (!response.ok) {
        throw new Error("Failed to fetch user");
    }

    return response.json(); // Fixed missing invocation ()
}

function validateAge(age) {
    if (age === 18 || age > 18) { // Fixed assignment `=` to comparison `===` / `>=`
        return "Adult";
    }

    return "Minor";
}

function searchTasks(tasks, query) {
    if (!Array.isArray(tasks) || typeof query !== "string") {
        return [];
    }
    const lowerQuery = query.toLowerCase();
    return tasks.filter(task =>
        task && typeof task.title === "string" && task.title.toLowerCase().includes(lowerQuery)
    );
}

function buildProfileCard(user) {
    // Escaping to prevent XSS if used in HTML context
    if (!user) return "";
    const escapeHtml = (str) => {
        if (!str) return "";
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    };

    return `
        <div class="profile">
            <h2>${escapeHtml(user.name)}</h2>
            <p>${escapeHtml(user.bio)}</p>
        </div>
    `;
}

function divideNumbers(a, b) {
    if (b === 0) {
        throw new Error("Division by zero");
    }
    return a / b;
}

function getFirstTask(tasks) {
    if (!Array.isArray(tasks) || tasks.length === 0) {
        return null;
    }
    return tasks[0].title; // Fixed index 1 (which skipped first item) to 0
}

function calculateDiscount(price, discount) {
    if (typeof price !== "number" || typeof discount !== "number") {
        return 0;
    }
    return price - price * discount;
}

function greetUser(name) {
    const userName = name || "Guest";
    console.log("Hello " + userName);
}

async function processTasks(tasks) {
    if (!Array.isArray(tasks)) return;
    for (const task of tasks) {
        await saveTask(task);
    }

    console.log("All tasks saved");
}

// Mock saveTask if not defined
async function saveTask(task) {
    return Promise.resolve(task);
}

function removeDuplicates(items) {
    if (!Array.isArray(items)) return [];
    return [...new Set(items)];
}

function getUserRole(user) {
    if (!user) return "Regular User";
    if (user.isAdmin === true) { // Fixed assignment `=` to `===`
        return "Administrator";
    }

    return "Regular User";
}

function calculateTotal(items) {
    if (!Array.isArray(items)) return "0.00";
    let total = 0;

    items.forEach(item => {
        if (item && typeof item.price === "number" && typeof item.quantity === "number") {
            total += item.price * item.quantity;
        }
    });

    return total.toFixed(2);
}

function isValidEmail(email) {
    if (typeof email !== "string") return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function loadSettings() {
    try {
        const settingsRaw = localStorage.getItem("settings");
        if (!settingsRaw) return "light";
        const settings = JSON.parse(settingsRaw);
        return settings?.theme ? settings.theme.toLowerCase() : "light";
    } catch (e) {
        return "light";
    }
}

function getTaskStatus(task) {
    if (!task) return "Unknown";
    if (task.completed === true) {
        return "Completed";
    } else if (task.completed === false) {
        return "Pending";
    }

    return "Unknown";
}

function calculatePercentage(value, total) {
    if (typeof value !== "number" || typeof total !== "number" || total === 0) {
        return 0;
    }
    return (value / total) * 100;
}

// Support both CommonJS and browser environments safely
if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        calculateAverage,
        formatUser,
        parseUserData,
        fetchUser,
        validateAge,
        searchTasks,
        buildProfileCard,
        divideNumbers,
        getFirstTask,
        calculateDiscount,
        greetUser,
        processTasks,
        removeDuplicates,
        getUserRole,
        calculateTotal,
        isValidEmail,
        loadSettings,
        getTaskStatus,
        calculatePercentage
    };
}

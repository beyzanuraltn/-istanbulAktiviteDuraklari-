document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;
    
    try {
        const response = await fetch("http://127.0.0.1:8000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        if (response.ok) {
            alert("Giriş başarılı!");
            window.location.href = "http://127.0.0.1:5501/%C4%B0STANBULAKT%C4%B0V%C4%B0TEDURAKLARIYEDEK2.html";  // Yönlendirme yapılacak adres
        } else {
            const data = await response.json();
            alert("Giriş başarısız: " + data.detail);
        }
    } catch (error) {
        alert("Bir hata oluştu: " + error.message);
    }

    document.getElementById("loginForm").reset();
});
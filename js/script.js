// 🎯 Fonction pour afficher un message de bienvenue
document.addEventListener("DOMContentLoaded", function() {
    console.log("Site AFR chargé avec succès !");
});

// 🎯 Ajout d’un effet de scroll doux pour les liens internes
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute("href")).scrollIntoView({
            behavior: "smooth"
        });
    });
});

// 🎯 Gestion du menu burger (si utilisé)
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector("nav ul");

menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
});

/********************************************************************************
 * WEB322 – Assignment 03
 *
 * I declare that this assignment is my own work in accordance with Seneca's
 * Academic Integrity Policy:
 *
 * https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
 *
 * Name: Harsimranjit Singh Student ID: 155452220 Date: 11-Oct-2024
 *
 * Published URL: https://lego-sets-a3.vercel.app
 *
 ********************************************************************************/

const express = require("express");
require("dotenv").config();
const legoData = require("./modules/legoSets");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3500;

app.set("view engine", "ejs");

legoData
  .initialize()
  .then(() => {
    app.use(express.static(path.join(__dirname, "/public")));

    // Home route
    app.get("/", (req, res) => {
      res.render("home", { page: "/" });
    });

    // About route
    app.get("/about", (req, res) => {
      res.render("about", { page: "/about" });
    });

    // Lego sets route with theme filter
    app.get("/lego/sets", (req, res) => {
      const { theme } = req.query;
      if (theme) {
        legoData
          .getSetsByTheme(theme)
          .then((sets) => {
            if (sets.length === 0) {
              // No sets found for the specified theme
              res.status(404).render("404", {
                page: "/lego/sets",
                message: `No sets found for theme: ${theme}`,
              });
            } else {
              res.render("sets", { page: "/lego/sets", sets: sets });
            }
          })
          .catch((err) =>
            res
              .status(404)
              .render("404", { page: "/lego/sets", message: err.message })
          );
      } else {
        legoData
          .getAllSets()
          .then((sets) =>
            res.render("sets", { page: "/lego/sets", sets: sets })
          )
          .catch((err) =>
            res
              .status(404)
              .render("404", { page: "/lego/sets", message: err.message })
          );
      }
    });

    // Specific Lego set route by ID
    app.get("/lego/sets/:numId", (req, res) => {
      const { numId } = req.params;
      legoData
        .getSetByNum(numId)
        .then((set) => {
          if (!set) {
            // No set found with the specified ID
            res.status(404).render("404", {
              page: "/lego/sets",
              message: `No set found with ID: ${numId}`,
            });
          } else {
            res.render("set", { page: "/lego/sets", set: set });
          }
        })
        .catch((err) =>
          res
            .status(404)
            .render("404", { page: "/lego/sets", message: err.message })
        );
    });

    // Catch-all 404 handler for undefined routes
    app.use((req, res) => {
      res.status(404).render("404", {
        page: "/404",
        message: "The page you're looking for doesn't exist.",
      });
    });

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });
  })
  .catch((err) => console.log(`Failed due to ${err}`));

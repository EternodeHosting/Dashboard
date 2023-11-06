const settings = require("../settings.json");
const fs = require('fs');
const indexjs = require("../index.js");
const fetch = require('node-fetch');

module.exports.load = async function(app, db) {
  app.get(`/api/password`, async (req, res) => {
    if (!req.session.userinfo.id) return res.redirect("/login");

    let checkPassword = await db.get("password-" + req.session.userinfo.id);

    if (checkPassword) {
      return res.json({ password: checkPassword });
    } else {
      let newsettings = JSON.parse(fs.readFileSync("./settings.json"));
      let newpassword = makeid(newsettings.api.client.passwordgenerator["length"]);

      await fetch(
        settings.pterodactyl.domain + "/api/application/users/" + req.session.pterodactyl.id,
        {
          method: "patch",
          headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${settings.pterodactyl.key}`
          },
          body: JSON.stringify({
            username: req.session.pterodactyl.username,
            email: req.session.pterodactyl.email,
            first_name: req.session.pterodactyl.first_name,
            last_name: req.session.pterodactyl.last_name,
            password: newpassword
          })
        }
      );

      await db.set("password-" + req.session.userinfo.id, newpassword)
      return res.json({ password: newpassword });
    }
  });

  app.get("/panel", async (req, res) => {
    res.redirect(settings.pterodactyl.domain);
  });

  app.get("/regen", async (req, res) => {
    if (!req.session.pterodactyl) return res.redirect("/login");
    
    let newsettings = JSON.parse(fs.readFileSync("./settings.json"));

    if (newsettings.api.client.allow.regen !== true) return res.send("You cannot regenerate your password currently.");

    let newpassword = makeid(newsettings.api.client.passwordgenerator["length"]);
    req.session.password = newpassword;

    await fetch(
      settings.pterodactyl.domain + "/api/application/users/" + req.session.pterodactyl.id,
      {
        method: "patch",
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${settings.pterodactyl.key}`
        },
        body: JSON.stringify({
          username: req.session.pterodactyl.username,
          email: req.session.pterodactyl.email,
          first_name: req.session.pterodactyl.first_name,
          last_name: req.session.pterodactyl.last_name,
          password: newpassword
        })
      }
    );

    let theme = indexjs.get(req);
    await db.set("password-" + req.session.userinfo.id, newpassword)
    res.redirect("/account")
  });
};

function makeid(length) {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
const express = require("express");
const jwt = require("jsonwebtoken");

function requireUser(req, res, next) {
  try {
    const tokenFromHeader = req.headers.authorization;
    const token = tokenFromHeader.replace("Bearer ", "");
    // Check if token exists
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const payload = jwt.verify(token, "gucci");
    req.user = payload;
    next ()
  } catch (error) {
    res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
  }
}

module.exports = {
  requireUser,
};

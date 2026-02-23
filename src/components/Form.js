"use client";
import "../style/components/Form.css";
import Input from "./commons/Input";
import Button from "./commons/Button";
import { useState } from "react";

export default function Form({ title }) {
  const [formData, setFormData] = useState({
    id: "",
    email: "",
    password: "",
    confirm_password: "",
    card: "false",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      const res = await fetch("/api/client", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: formData.id,
          email: formData.email,
          password: formData.password,
          card: formData.card === "true",
        }),
      });

      if (!res.ok) throw new Error("Erreur API");

      alert("Client ajouté avec succès ✅");

      setFormData({
        id: "",
        email: "",
        password: "",
        confirm_password: "",
        card: "false",
      });
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'ajout");
    }
  };

  return (
    <div className="form-container">
      <h3>{title}</h3>
      <form className="form" onSubmit={handleSubmitForm}>
        <Input
          type="text"
          name="id"
          placeholder="Identifiant"
          value={formData.id}
          onChange={handleChange}
        />
        <Input
          type="text"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <Input
          type="text"
          name="password"
          placeholder="Mot de passe"
          value={formData.password}
          onChange={handleChange}
        />
        <Input
          type="text"
          name="confirm_password"
          placeholder="Confirmation mot de passe"
          value={formData.confirm_password}
          onChange={handleChange}
        />
        <div className="radio-buttons">
          Carte de fidélité ?
          <div>
            <label>
              Oui{" "}
              <Input
                type="radio"
                name="card"
                value="true"
                checked={formData.card === "true"}
                onChange={handleChange}
              />
            </label>
            <label>
              Non{" "}
              <Input
                type="radio"
                name="card"
                value="false"
                checked={formData.card === "false"}
                onChange={handleChange}
              />
            </label>
          </div>
        </div>

        <Button
          text="Ajouter le client"
          style={{ width: "100%" }}
          onClick={handleSubmitForm}
        />
      </form>
    </div>
  );
}

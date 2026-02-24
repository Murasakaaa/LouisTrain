"use client";
import "../style/components/Form.css";
import Input from "./commons/Input";
import Button from "./commons/Button";

export default function Form({ title, formData, setFormData, fetchData }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/abonnement/demande_abo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          num_carte: formData.num_card,
        }),
      });

      if (!res.ok) throw new Error("Erreur API");

      alert("Abonné ajouté avec succès");

      setFormData({
        email: "",
        num_card: "",
      });

      await fetchData();
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
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <Input
          type="text"
          name="num_card"
          placeholder="N°Carte"
          value={formData.num_card}
          onChange={handleChange}
        />

        <Button
          text="Ajouter l'abonné"
          style={{ width: "100%" }}
          onClick={handleSubmitForm}
        />
      </form>
    </div>
  );
}

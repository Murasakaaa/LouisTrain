"use client";
import "../style/components/Form.css";
import Input, { DropDown } from "./commons/Input";
import Button from "./commons/Button";

export default function Form({ title }) {
  const options = [
    "Homme",
    "Femme",
    "Je ne souhaite pas me prononcer",
    "Autres",
  ];

  const handleSubmitForm = () => {
    console.log("Submit form");
  };
  return (
    <div className="form-container">
      <h3>{title}</h3>
      <form action="" className="form">
        <DropDown defaultValue="Civilité" options={options} name="civility" />
        <div className="names">
          <Input
            type="text"
            name="lastname"
            placeholder="Nom"
            darkInput={false}
          />
          <Input
            type="text"
            name="firstname"
            placeholder="Prénom"
            darkInput={false}
          />
        </div>
        <Input
          type="text"
          name="phone"
          placeholder="Téléphone"
          darkInput={false}
        />
        <p>Ou</p>
        <Input type="text" name="email" placeholder="Mail" darkInput={false} />
        <Input
          type="text"
          name="card_number"
          placeholder="N°Carte d'abonnement"
          darkInput={false}
        />
        <Button
          text="Ajouter le client"
          style={{ width: "100%" }}
          onClick={handleSubmitForm}
        />
      </form>
    </div>
  );
}

import React from "react";
import "../style/components/Form.css";
import Input, { DropDown } from "./commons/Input";

export default function Form({ title }: { title: string }) {
  const options = [
    "Civilité",
    "Homme",
    "Femme",
    "Je ne souhaite pas me prononcer",
    "Autres",
  ];
  return (
    <div className="form-container">
      <h3>{title}</h3>
      <form action="" className="form">
        <DropDown options={options} name="civility" />
        <div>
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
      </form>
    </div>
  );
}

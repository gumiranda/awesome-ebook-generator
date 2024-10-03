"use client";
import React, { useState, useEffect } from "react";

// Simular a busca de dados de um servidor remoto de forma assíncrona
const fetchData = (): Promise<Establishment[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          name: "Beauty Salon A",
          address: "123 Main St",
          services: ["Corte", "Coloração", "Manicure"],
          priceRange: "$$",
          rating: 4.5,
          location: "Centro",
          availability: "10:00-18:00",
          unisex: true,
        },
        {
          id: 2,
          name: "Luxury Beauty",
          address: "456 Market Ave",
          services: ["Spa", "Maquiagem"],
          priceRange: "$$$$",
          rating: 4.8,
          location: "Bairro Alto",
          availability: "09:00-20:00",
          unisex: false,
        },
        {
          id: 3,
          name: "Glamour Salon",
          address: "789 Ocean Dr",
          services: ["Corte", "Barbearia"],
          priceRange: "$",
          rating: 4.0,
          location: "Praia",
          availability: "08:00-16:00",
          unisex: true,
        },
      ]);
    }, 1000);
  });
};

// Estilos adaptáveis
const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    textAlign: "center" as const,
  },
  list: {
    listStyleType: "none",
    padding: 0,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center" as const,
  },
  listItem: {
    margin: "10px 0",
    padding: "15px",
    backgroundColor: "#f4f4f4",
    borderRadius: "8px",
    width: "100%",
    maxWidth: "600px",
    boxSizing: "border-box" as const,
  },
  input: {
    padding: "10px",
    width: "100%",
    boxSizing: "border-box" as const,
  },
  select: {
    padding: "10px",
    width: "100%",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
};

// Interfaces
interface Establishment {
  id: number;
  name: string;
  address: string;
  services: string[];
  priceRange: string;
  rating: number;
  location: string;
  availability: string;
  unisex: boolean;
}

const EstablishmentItem = ({
  id,
  name,
  address,
  services,
  priceRange,
  rating,
  location,
  availability,
  unisex,
}: Establishment) => (
  <li key={id} style={styles.listItem}>
    <h2>{name}</h2>
    <p>{address}</p>
    <p>Serviços: {services.join(", ")}</p>
    <p>Faixa de Preço: {priceRange}</p>
    <p>Avaliação: {rating} estrelas</p>
    <p>Localização: {location}</p>
    <p>Horário: {availability}</p>
    <p>Unissex: {unisex ? "Sim" : "Não"}</p>
  </li>
);

const EstablishmentList: React.FC = () => {
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [filteredEstablishments, setFilteredEstablishments] = useState<
    Establishment[]
  >([]);
  const [filterName, setFilterName] = useState<string>("");
  const [filterService, setFilterService] = useState<string>("");
  const [filterPrice, setFilterPrice] = useState<string>("");
  const [filterRating, setFilterRating] = useState<string>("0");
  const [filterLocation, setFilterLocation] = useState<string>("");
  const [filterUnisex, setFilterUnisex] = useState<string>("");

  useEffect(() => {
    // Carregar dados da "API"
    const loadData = async () => {
      const data = await fetchData();
      setEstablishments(data);
      setFilteredEstablishments(data);
    };

    loadData();
  }, []);

  useEffect(() => {
    // Função para filtrar estabelecimentos
    const handleFilterChange = () => {
      const filtered = establishments.filter((establishment) => {
        const matchesName = establishment.name
          .toLowerCase()
          .includes(filterName.toLowerCase());
        const matchesService = filterService
          ? establishment.services.includes(filterService)
          : true;
        const matchesPrice = filterPrice
          ? establishment.priceRange === filterPrice
          : true;
        const matchesRating = establishment.rating >= parseFloat(filterRating);
        const matchesLocation = establishment.location
          .toLowerCase()
          .includes(filterLocation.toLowerCase());
        const matchesUnisex = filterUnisex
          ? filterUnisex === "true"
            ? establishment.unisex
            : !establishment.unisex
          : true;

        return (
          matchesName &&
          matchesService &&
          matchesPrice &&
          matchesRating &&
          matchesLocation &&
          matchesUnisex
        );
      });
      setFilteredEstablishments(filtered);
    };

    handleFilterChange();
  }, [
    filterName,
    filterService,
    filterPrice,
    filterRating,
    filterLocation,
    filterUnisex,
    establishments,
  ]);

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Lista de Salões de Beleza</h1>
      <input
        type="text"
        placeholder="Filtrar por nome..."
        value={filterName}
        onChange={(e) => setFilterName(e.target.value)}
        style={styles.input}
      />
      <select
        value={filterService}
        onChange={(e) => setFilterService(e.target.value)}
        style={styles.select}
      >
        <option value="">Filtrar por serviço</option>
        <option value="Corte">Corte</option>
        <option value="Coloração">Coloração</option>
        <option value="Manicure">Manicure</option>
        <option value="Maquiagem">Maquiagem</option>
        <option value="Spa">Spa</option>
        <option value="Barbearia">Barbearia</option>
      </select>
      <select
        value={filterPrice}
        onChange={(e) => setFilterPrice(e.target.value)}
        style={styles.select}
      >
        <option value="">Filtrar por faixa de preço</option>
        <option value="$">$ (Econômico)</option>
        <option value="$$">$$ (Moderado)</option>
        <option value="$$$">$$$ (Caro)</option>
        <option value="$$$$">$$$$ (Luxo)</option>
      </select>
      <select
        value={filterRating}
        onChange={(e) => setFilterRating(e.target.value)}
        style={styles.select}
      >
        <option value="0">Filtrar por avaliação</option>
        <option value="4">4 estrelas ou mais</option>
        <option value="4.5">4.5 estrelas ou mais</option>
        <option value="5">Somente 5 estrelas</option>
      </select>
      <input
        type="text"
        placeholder="Filtrar por localização..."
        value={filterLocation}
        onChange={(e) => setFilterLocation(e.target.value)}
        style={styles.input}
      />
      <select
        value={filterUnisex}
        onChange={(e) => setFilterUnisex(e.target.value)}
        style={styles.select}
      >
        <option value="">Filtrar por Unissex</option>
        <option value="true">Sim</option>
        <option value="false">Não</option>
      </select>
      <ul style={styles.list}>
        {filteredEstablishments.map((establishment) => (
          <EstablishmentItem key={establishment.id} {...establishment} />
        ))}
      </ul>
    </div>
  );
};

export default EstablishmentList;

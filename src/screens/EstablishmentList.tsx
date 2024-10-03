"use client";

import React, { useState, useEffect, useCallback, ChangeEvent } from "react";

// Define style constants
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

// Define interfaces
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

// Mock data fetching function
const fetchEstablishmentData = async (): Promise<Establishment[]> => {
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

const EstablishmentItem: React.FC<Establishment> = ({
  name,
  address,
  services,
  priceRange,
  rating,
  location,
  availability,
  unisex,
}) => (
  <li style={styles.listItem}>
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

const useEstablishments = () => {
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [filteredEstablishments, setFilteredEstablishments] = useState<
    Establishment[]
  >([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchEstablishmentData();
      setEstablishments(data);
      setFilteredEstablishments(data);
    };
    loadData();
  }, []);

  return { establishments, filteredEstablishments, setFilteredEstablishments };
};

const useFilters = () => {
  const [filters, setFilters] = useState({
    name: "",
    service: "",
    price: "",
    rating: "0",
    location: "",
    unisex: "",
  });

  const handleFilterInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  return { filters, handleFilterInputChange };
};

const filterEstablishments = (
  establishments: Establishment[],
  filters: any,
): Establishment[] => {
  return establishments.filter((establishment) => {
    const { name, service, price, rating, location, unisex } = filters;

    const matchesName = establishment.name
      .toLowerCase()
      .includes(name.toLowerCase());
    const matchesService = service
      ? establishment.services.includes(service)
      : true;
    const matchesPrice = price ? establishment.priceRange === price : true;
    const matchesRating = establishment.rating >= parseFloat(rating);
    const matchesLocation = establishment.location
      .toLowerCase()
      .includes(location.toLowerCase());
    const matchesUnisex = unisex
      ? unisex === "true"
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
};

const EstablishmentList: React.FC = () => {
  const { establishments, filteredEstablishments, setFilteredEstablishments } =
    useEstablishments();
  const { filters, handleFilterInputChange } = useFilters();

  const applyFilters = useCallback(() => {
    const filtered = filterEstablishments(establishments, filters);
    setFilteredEstablishments(filtered);
  }, [filters, establishments, setFilteredEstablishments]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Lista de Salões de Beleza</h1>
      <FilterControls
        filters={filters}
        onFilterChange={handleFilterInputChange}
      />
      <EstablishmentDisplay establishments={filteredEstablishments} />
    </div>
  );
};

const FilterControls: React.FC<{
  filters: any;
  onFilterChange: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
}> = ({ filters, onFilterChange }) => (
  <>
    <input
      type="text"
      placeholder="Filtrar por nome..."
      name="name"
      value={filters.name}
      onChange={onFilterChange}
      style={styles.input}
    />
    <select
      name="service"
      value={filters.service}
      onChange={onFilterChange}
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
      name="price"
      value={filters.price}
      onChange={onFilterChange}
      style={styles.select}
    >
      <option value="">Filtrar por faixa de preço</option>
      <option value="$">$ (Econômico)</option>
      <option value="$$">$$ (Moderado)</option>
      <option value="$$$">$$$ (Caro)</option>
      <option value="$$$$">$$$$ (Luxo)</option>
    </select>
    <select
      name="rating"
      value={filters.rating}
      onChange={onFilterChange}
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
      name="location"
      value={filters.location}
      onChange={onFilterChange}
      style={styles.input}
    />
    <select
      name="unisex"
      value={filters.unisex}
      onChange={onFilterChange}
      style={styles.select}
    >
      <option value="">Filtrar por Unissex</option>
      <option value="true">Sim</option>
      <option value="false">Não</option>
    </select>
  </>
);

const EstablishmentDisplay: React.FC<{ establishments: Establishment[] }> = ({
  establishments,
}) => (
  <ul style={styles.list}>
    {establishments.map((establishment) => (
      <EstablishmentItem key={establishment.id} {...establishment} />
    ))}
  </ul>
);

export default EstablishmentList;

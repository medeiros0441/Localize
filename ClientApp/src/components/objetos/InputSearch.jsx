import React, { useState } from 'react';

// Componente de pesquisa com sugestões
const InputSearch = ({ 
    id, 
    name, 
    value, 
    onChange, 
    placeholder, 
    suggestions = [], // Sugestões padrão vazias, se não forem passadas
    label, 
    onSuggestionClick // Função chamada quando uma sugestão é selecionada
}) => {
    // Estado para armazenar as sugestões filtradas
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);

    // Manipulador de mudança para o campo de entrada
    const handleInputChange = (e) => {
        const query = e.target.value; // Obtém o valor do input

        // Passa o valor correto para o manipulador de mudança
        onChange({
            target: {
                name,
                value: query, // Atualiza o valor com a consulta do input
            },
        });

        // Filtra as sugestões com base na consulta do usuário
        setFilteredSuggestions(
            suggestions.filter((suggestion) =>
                suggestion.label.toLowerCase().includes(query.toLowerCase())
            )
        );
    };

    // Manipulador de clique para uma sugestão selecionada
    const handleSuggestionClick = (suggestion) => {
        // Atualiza o valor do input com a label da sugestão selecionada
        onChange({
            target: {
                name,
                value: suggestion.label, // A label da sugestão selecionada
            },
        });

        // Chama a função onSuggestionClick se ela foi passada como prop
        if (onSuggestionClick) {
            onSuggestionClick(suggestion); // Executa a função passada com a sugestão
        }

        // Limpa as sugestões após a seleção
        setFilteredSuggestions([]);
    };

    return (
        <div className="position-relative form-floating mb-2">
            <input
                id={id}
                name={name}
                value={value} // Exibe o valor atual do input
                onChange={handleInputChange} // Chamamos a função ao digitar
                placeholder={placeholder}
                className="form-control"
                type="text"
                // Armazena o ID correspondente à sugestão no data-value
                data-value={suggestions.find(suggestion => suggestion.label === value)?.value || ''}
            />
            <label htmlFor={id}>{label}</label>

            {/* Renderiza a lista de sugestões se houver sugestões filtradas */}
            {filteredSuggestions.length > 0 && (
                <ul className="list-group position-absolute w-100" style={{ zIndex: 1000 }}>
                    {filteredSuggestions.map((suggestion, index) => (
                        <li 
                            key={index} 
                            className="list-group-item"
                            onClick={() => handleSuggestionClick(suggestion)} // Adiciona o manipulador de clique
                        >
                            {suggestion.label} {/* Exibe a propriedade 'label' da sugestão */}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default InputSearch;

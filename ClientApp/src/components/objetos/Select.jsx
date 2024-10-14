import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Select = forwardRef(({ id, name, options = [], value, onChange, className = '', label }, ref) => {
    // Verifica se options é um array e não é nulo ou indefinido
    const renderOptions = Array.isArray(options) ? options : [];

    return (
        <div className={`form-floating mb-2 ${className}`}>
            <select
                id={id}
                name={name}
                className="form-control"
                value={value}
                onChange={onChange}
                ref={ref}
            >
                {renderOptions.map(({ value: optionValue, label: optionLabel }) => (
                    <option key={optionValue} value={optionValue}>
                        {optionLabel}
                    </option>
                ))}
            </select>
            <label htmlFor={id}>{label}</label>
        </div>
    );
});

// Definição dos tipos das props
Select.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.oneOfType([ // Aceitando boolean, string e outros tipos
                PropTypes.string,
                PropTypes.bool,
                PropTypes.number // Adicione mais tipos conforme necessário
            ]).isRequired,
            label: PropTypes.string.isRequired,
        })
    ).isRequired,
    value: PropTypes.oneOfType([ // Aceitando boolean, string e outros tipos
        PropTypes.string,
        PropTypes.bool,
        PropTypes.number // Adicione mais tipos conforme necessário
    ]).isRequired,
    onChange: PropTypes.func.isRequired,
    className: PropTypes.string,
    label: PropTypes.string.isRequired,
};

export default Select;

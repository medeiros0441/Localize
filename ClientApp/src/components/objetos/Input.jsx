import React from 'react';
import InputMask from 'react-input-mask'; // Importa a biblioteca para máscaras

// Refatorando o Input para aceitar máscara
const Input = React.memo(
  React.forwardRef(({ id, name, type = 'text', label, value, onChange, mask }, ref) => {
    return (
      <div className={`form-floating mb-2`}>
        {mask ? (
          <InputMask
            type={type}
            className="form-control"
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            mask={mask} // Adicionando a propriedade de máscara
            ref={ref} // Encaminhando a referência para o input
          />
        ) : (
          <input
            type={type}
            className="form-control"
            id={id}
            name={name}
            value={value}
            onChange={onChange} // Certifique-se de que onChange está sendo usado corretamente
            ref={ref} // Encaminhando a referência para o input
          />
        )}
        <label htmlFor={id}>{label}</label>
      </div>
    );
  })
);

export default Input;

import React, { useState } from 'react';
import { useCustomModal } from 'src/components/objetos/Modal';
import alerta from 'src/utils/alerta';
import useCobrancaForm from './useCobrancaForm'; // Importe o hook para o formulário de Cobrança

const useCobrancaModal = (id) => {
    const { CustomModal, setShow } = useCustomModal();
    const [cobrancaId, setCobrancaId] = useState(null);
    const { renderForm } = useCobrancaForm(cobrancaId, false); // Chama o hook aqui

    const openModal = (id_cobranca = false, view = false) => {
        if (!id_cobranca) {
            alerta('ID da cobrança não fornecido');
            return setShow(false);
        }

        setCobrancaId(id_cobranca); // Armazena o ID da cobrança
        setShow(view);
    };

    const renderFooter = () => (
        <button
            type="button"
            className="btn btn-secondary btn-sm mx-auto"
            onClick={() => setShow(false)}
        >
            Fechar
        </button>
    );

    const CobrancaModalComponent = () => (
        <CustomModal
            icon="money" // Substitua pelo ícone apropriado para cobranças
            title="Visualizar Cobrança"
            children={renderForm()}
            footer={renderFooter()}
        />
    );

    return { openModal, CobrancaModalComponent };
};

export default useCobrancaModal;

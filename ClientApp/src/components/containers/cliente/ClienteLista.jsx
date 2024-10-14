import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '@objetos/Table';
import useClienteModal from './useClienteModal';
import useConfirmationModal from '@objetos/useConfirmationModal';
import  ClienteService   from '@service/ClienteService';
import Alerta from '@utils/alerta';
import useCobrancaModal from '@cobranca/useCobrancaModal';
const ClienteLista = () => {
    const [clientes, setClientes] = useState([]);
    const navigate = useNavigate(); // Usando useNavigate para navegação

    const { openModal: openClienteModal, ClienteModalComponent } = useClienteModal();
    const { openModal: openConfirmationModal, ConfirmationModalComponent } = useConfirmationModal();
    const { openModal: openCobrancaModal, CobrancaModalComponent } = useCobrancaModal();

    const fetchClientes = useCallback(async () => {
        try {
            const response = await ClienteService.getAllClientes();
            if (response.sucesso) {
                setClientes(response.clientes);
            } else {
                Alerta(response.message,3,"id_msg");
            }
        } catch (error) {
            Alerta('Erro ao buscar clientes'+ error,2,"id_msg");
        }
    }, []);

    useEffect(() => {
        fetchClientes();
    }, [fetchClientes]);

    const handleDelete = async (id) => {
        if (!id){
            Alerta('Erro ao excluir cliente, ID não enviado.', 2, 'id_msg');
            return
        }
        openConfirmationModal(
            'Confirmar Exclusão',
            'Você tem certeza que deseja excluir este cliente?',
            async () => {
                try {
                    const response = await ClienteService.deleteCliente(id);
                    if (response.sucesso) {
                        setClientes(prevClientes => prevClientes.filter(cliente => cliente.Id !== id));
                        Alerta(response.message);
                    } else {
                        Alerta(response.message, 2, 'id_msg');
                    }
                } catch (error) {
                    Alerta('Erro ao excluir cliente'+ error, 2, 'id_msg');
                }
            }
        );
    };

     // Função renderCobranca agora definida como uma variável de função dentro do componente
     const renderCobranca = (cobrancas) => {
        if (cobrancas.length === 0) {
            return (
                <span className="badge bg-light-subtle text-light-emphasis rounded-pill">
                    Nenhuma cobrança
                </span>
            );
        }
    
        // Contador de cobranças pendentes
        const quantidadePendente = cobrancas.filter(c => !c.pago).length;
    
        if (quantidadePendente === 0) {
            return (
                <span className="badge bg-success  text-success-emphasis  fw-bold rounded-pill">
                    Todas pagas
                </span>
            );
        }
    
        return (
            <span className="badge bg-danger  text-ligth-emphasis  fw-bold  rounded-pill">
                {quantidadePendente} pendentes
            </span>
        );
    };
    
    
    const columns = ['Nome', 'Telefone','Cobranças', 'Ações'];
    
    
    const rows = clientes.map(cliente => ({
        data: [
            cliente.nome,
            cliente.telefone,
            renderCobranca(cliente.cobrancas)
        ],
        actions: [
            {
                name: 'adicionar',
                icon: 'plus-lg',
                type: 'primary',
                onClick: () => navigate(`/cobranca/create/${cliente.id}`)
            },  {
                name: 'Editar',
                icon: 'pencil',
                type: 'warning',
                onClick: () => navigate(`/cliente/edit/${cliente.id}`)
            },
            
            {
                name: 'Visualizar',
                icon: 'eye',
                type: 'success',
                onClick: () => openClienteModal(cliente.id,true)
            },
            {
                name: 'Excluir',
                icon: 'trash',
                type: 'danger',
                onClick: () => handleDelete(cliente.id)
            }
        ]
    }));

    const dataHeader = {
        icon: 'people',
        title: 'Lista de Clientes',
        iconBtn: 'plus',
        buttonText: 'Criar Novo Cliente',
        onClickBtn: () => navigate('/cliente/create/')
    };

    return (
        <div id='id_msg'>
            <Table
                dataHeader={dataHeader}
                columns={columns}
                rows={rows}
            />
            <CobrancaModalComponent />
            <ClienteModalComponent />
            <ConfirmationModalComponent />
        </div>
    );
};

export default ClienteLista;

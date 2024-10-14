import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '@objetos/Table';
import useConfirmationModal from '@objetos/useConfirmationModal';
import CobrancaService from '@service/CobrancaService';
import Alerta from '@utils/alerta';
import useCobrancaModal from './useCobrancaModal';

const CobrancaLista = () => {
    const [cobrancas, setCobrancas] = useState([]);
    const navigate = useNavigate();
    const { openModal: openConfirmationModal, ConfirmationModalComponent } = useConfirmationModal();
    const { openModal, CobrancaModalComponent } = useCobrancaModal();

    const fetchCobrancas = useCallback(async () => {
        try {
            const response = await CobrancaService.getAllCobrancas();
            if (response.sucesso) {
                setCobrancas(response.cobrancas);
            } else {
                Alerta(response.message, 3, "id_msg");
            }
        } catch (error) {
            Alerta(`Erro ao buscar cobranças: ${error.message || error}`, 2, "id_msg");
        }
    }, []);

    useEffect(() => {
        fetchCobrancas();
    }, [fetchCobrancas]);

    const handleDelete = async (id) => {
        if (!id) {
            Alerta('Erro ao excluir cobrança, ID não enviado.', 2, 'id_msg');
            return;
        }

        openConfirmationModal(
            'Confirmar Exclusão',
            'Você tem certeza que deseja excluir esta cobrança?',
            async () => {
                try {
                    const response = await CobrancaService.deleteCobranca(id);
                    if (response.sucesso) {
                        setCobrancas(prevCobrancas => prevCobrancas.filter(cobranca => cobranca.id !== id));
                        Alerta(response.message);
                    } else {
                        Alerta(response.message, 2, 'id_msg');
                    }
                } catch (error) {
                    Alerta(`Erro ao excluir cobrança: ${error.message || error}`, 2, 'id_msg');
                }
            }
        );
    };

    const handleUpdatePayment = async (id) => {
        if (!id) {
            Alerta('Erro ao atualizar pagamento, ID não enviado.', 2, 'id_msg');
            return;
        }
        openConfirmationModal(
            'Confirmar Atualização de Pagamento',
            'Você tem certeza que deseja marcar esta cobrança como paga?',
            async () => {
                try {
                    // Chama o método updatePago com o ID da cobrança e o novo valor de pagamento
                    const response = await CobrancaService.updatePago(id, true);  
                    
                    if (response.sucesso) {
                        // Atualiza a lista de cobranças para refletir a mudança
                        setCobrancas(prevCobrancas => 
                            prevCobrancas.map(cobranca => 
                                cobranca.id === id ? { ...cobranca, pago: true } : cobranca
                            )
                        );
                        Alerta("Status alterado com Sucesso.");
                    } else {
                        Alerta(response.message, 2, 'id_msg');
                    }
                } catch (error) {
                    Alerta(`Erro ao atualizar pagamento: ${error.message || error}`, 2, 'id_msg');
                }
            }
        );
        
    };

    const sortCobrancas = (cobrancas) => {
        return cobrancas.sort((a, b) => {
            if (a.pago !== b.pago) {
                return a.pago ? 1 : -1;
            }
            return new Date(b.data) - new Date(a.data);
        });
    };
    const renderCobranca = (pago, data) => {
        const hoje = new Date();
        const dataCobranca = new Date(data);
    
        // Caso a cobrança esteja paga, retorna o badge "Pago"
        if (pago) {
            return (
                <span className="badge bg-success-subtle text-success-emphasis  fw-bolder rounded-pill">
                    Pago
                </span>
            );
        }
    
        // Verifica se a data da cobrança está no futuro (em aberto)
        if (dataCobranca > hoje) {
            return (
                <span className="badge bg-warning-subtle text-warning-emphasis  fw-bolder rounded-pill">
                    Em aberto
                </span>
            );
        }
    
        // Caso contrário, se a data for no passado, está atrasada
        return (
            <span className="badge bg-danger-subtle text-danger-emphasis fw-bolder rounded-pill">
                Atrasada
            </span>
        );
    };
    
    const columns = ['Descrição', 'Valor', 'Vencimento', 'Status', 'Ações'];
    const rows = sortCobrancas(cobrancas).map(cobranca => {
        // Formatação dos dados da cobrança
        const formattedData = [
            cobranca.descricao,
             cobranca.valor,
            new Date(cobranca.data).toLocaleDateString(),
            renderCobranca(cobranca.pago,cobranca.data),
        ];
    
        // Criação das ações
        const actions = [];
    
        // Adiciona o botão 'Dar Baixa' somente se a cobrança não estiver paga
        if (!cobranca.pago) {
            actions.push({
                name: 'Dar Baixa',
                icon: 'check-lg',
                type: 'warning',
                onClick: () => handleUpdatePayment(cobranca.id),
                disabled: cobranca.pago, // Desabilita se já estiver pago
            });
        }
    
        // Adiciona sempre os botões 'Visualizar', 'Editar' e 'Excluir'
        actions.push(
            {
                name: 'Visualizar',
                icon: 'eye',
                type: 'success',
                onClick: () => openModal(cobranca.id, true),
            },
            {
                name: 'Editar',
                icon: 'pencil',
                type: 'primary',
                onClick: () => navigate(`/cobranca/edit/${cobranca.id}`),
            },
            {
                name: 'Excluir',
                icon: 'trash',
                type: 'danger',
                onClick: () => handleDelete(cobranca.id),
            }
        );
    
        return {
            data: formattedData,
            actions: actions,
        };
    });
    

    const dataHeader = {
        icon: 'file-invoice',
        title: 'Lista de Cobranças',
        iconBtn: 'plus',
        buttonText: 'Criar Nova Cobrança',
        onClickBtn: () => navigate('/cobranca/create/')
    };

    return (
        <div id='id_msg'>
            <Table
                dataHeader={dataHeader}
                columns={columns}
                rows={rows}
            /> 
             <CobrancaModalComponent />
            <ConfirmationModalComponent />
        </div>
    );
};

export default CobrancaLista;

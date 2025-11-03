import { useState, useEffect } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/table';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { parametrosApi, type Parametro } from '@/api/parametros.api';

const Parametros = () => {
  const [parametros, setParametros] = useState<Parametro[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingParam, setEditingParam] = useState<Parametro | null>(null);
  const [formData, setFormData] = useState({
    chave: '',
    peso: '',
    descricao: '',
  });

  // Carregar parâmetros ao montar o componente
  useEffect(() => {
    loadParametros();
  }, []);

  const loadParametros = async () => {
    try {
      setIsLoading(true);
      const data = await parametrosApi.getAll();
      setParametros(data);
    } catch (error) {
      console.error('Erro ao carregar parâmetros:', error);
      alert('Erro ao carregar parâmetros');
    } finally {
      setIsLoading(false);
    }
  };

  const columns: ColumnDef<Parametro>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: 'chave',
      header: 'Chave',
    },
    {
      accessorKey: 'peso',
      header: 'Peso',
    },
    {
      accessorKey: 'descricao',
      header: 'Descrição',
    },
  ];

  const handleOpenModal = () => {
    setEditingParam(null);
    setFormData({ chave: '', peso: '', descricao: '' });
    setIsModalOpen(true);
  };

  const handleRowClick = (parametro: Parametro) => {
    setEditingParam(parametro);
    setFormData({
      chave: parametro.chave,
      peso: parametro.peso,
      descricao: parametro.descricao,
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.chave || !formData.peso || !formData.descricao) {
      alert('Preencha todos os campos');
      return;
    }

    try {
      if (editingParam) {
        // Editar parâmetro existente
        await parametrosApi.update(editingParam.id, formData);
      } else {
        // Criar novo parâmetro
        await parametrosApi.create(formData);
      }

      // Recarregar lista de parâmetros
      await loadParametros();
      setIsModalOpen(false);
      setFormData({ chave: '', peso: '', descricao: '' });
    } catch (error) {
      console.error('Erro ao salvar parâmetro:', error);
      alert('Erro ao salvar parâmetro');
    }
  };

  const handleModalDelete = async () => {
    if (!editingParam || !confirm('Deseja realmente excluir este parâmetro?')) {
      return;
    }

    try {
      await parametrosApi.delete(editingParam.id);
      await loadParametros();
      setIsModalOpen(false);
      setFormData({ chave: '', peso: '', descricao: '' });
    } catch (error) {
      console.error('Erro ao excluir parâmetro:', error);
      alert('Erro ao excluir parâmetro');
    }
  };

  return (
    <div className="p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Parâmetros</h1>
            <p className="text-muted-foreground mt-2">
              Configure os parâmetros do sistema
            </p>
          </div>
          <Button onClick={handleOpenModal}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Parâmetro
          </Button>
        </div>

        <div className="bg-card border rounded-lg p-6">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Carregando parâmetros...
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={parametros}
              searchKey="chave"
              searchPlaceholder="Buscar por chave..."
              onRowClick={handleRowClick}
            />
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingParam ? 'Editar Parâmetro' : 'Novo Parâmetro'}
        onSave={handleSave}
        onDelete={editingParam ? handleModalDelete : undefined}
        saveText="Salvar"
        deleteText="Excluir"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="chave">Chave</Label>
            <Input
              id="chave"
              placeholder="nome_do_parametro"
              value={formData.chave}
              onChange={(e) =>
                setFormData({ ...formData, chave: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="peso">Peso</Label>
            <Input
              id="peso"
              placeholder="Peso do parâmetro"
              value={formData.peso}
              onChange={(e) =>
                setFormData({ ...formData, peso: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Input
              id="descricao"
              placeholder="Descrição do parâmetro"
              value={formData.descricao}
              onChange={(e) =>
                setFormData({ ...formData, descricao: e.target.value })
              }
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Parametros;

import { useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/table';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';

interface Parametro {
  id: number;
  chave: string;
  peso: string;
  descricao: string;
}

const Parametros = () => {
  const [parametros, setParametros] = useState<Parametro[]>([
    { id: 1, chave: 'parametro_1', peso: '1', descricao: 'Parâmetro 1' },
    { id: 2, chave: 'parametro_2', peso: '2', descricao: 'Parâmetro 2' },
    { id: 3, chave: 'parametro_3', peso: '3', descricao: 'Parâmetro 3' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingParam, setEditingParam] = useState<Parametro | null>(null);
  const [formData, setFormData] = useState({
    chave: '',
    peso: '',
    descricao: '',
  });

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

  const handleSave = () => {
    if (!formData.chave || !formData.peso || !formData.descricao) {
      alert('Preencha todos os campos');
      return;
    }

    if (editingParam) {
      // Editar parâmetro existente
      setParametros(
        parametros.map((p) =>
          p.id === editingParam.id
            ? { ...p, ...formData }
            : p
        )
      );
    } else {
      // Criar novo parâmetro
      const newParam: Parametro = {
        id: Math.max(...parametros.map((p) => p.id), 0) + 1,
        ...formData,
      };
      setParametros([...parametros, newParam]);
    }

    setIsModalOpen(false);
    setFormData({ chave: '', peso: '', descricao: '' });
  };

  const handleModalDelete = () => {
    if (editingParam && confirm('Deseja realmente excluir este parâmetro?')) {
      setParametros(parametros.filter((p) => p.id !== editingParam.id));
      setIsModalOpen(false);
      setFormData({ chave: '', peso: '', descricao: '' });
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
          <DataTable
            columns={columns}
            data={parametros}
            searchKey="chave"
            searchPlaceholder="Buscar por chave..."
            onRowClick={handleRowClick}
          />
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

import { useState, useEffect } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/table';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { usuariosApi, type Usuario } from '@/api/usuarios.api';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cargo: '',
    departamento: '',
    status: 'ativo',
  });

  // Carregar usuários ao montar o componente
  useEffect(() => {
    loadUsuarios();
  }, []);

  const loadUsuarios = async () => {
    try {
      setIsLoading(true);
      const data = await usuariosApi.getAll();
      setUsuarios(data);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      alert('Erro ao carregar usuários');
    } finally {
      setIsLoading(false);
    }
  };

  const columns: ColumnDef<Usuario>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: 'nome',
      header: 'Nome',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'cargo',
      header: 'Cargo',
    },
    {
      accessorKey: 'departamento',
      header: 'Departamento',
    },
    {
      accessorKey: 'status',
      header: 'Status',
    },
  ];

  const handleOpenModal = () => {
    setEditingUser(null);
    setFormData({ nome: '', email: '', cargo: '', departamento: '', status: 'ativo' });
    setIsModalOpen(true);
  };

  const handleRowClick = (usuario: Usuario) => {
    setEditingUser(usuario);
    setFormData({
      nome: usuario.nome,
      email: usuario.email,
      cargo: usuario.cargo,
      departamento: usuario.departamento,
      status: usuario.status,
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.nome || !formData.email || !formData.cargo || !formData.departamento) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      if (editingUser) {
        // Editar usuário existente
        await usuariosApi.update(editingUser.id, formData);
      } else {
        // Criar novo usuário
        await usuariosApi.create(formData);
      }

      // Recarregar lista de usuários
      await loadUsuarios();
      setIsModalOpen(false);
      setFormData({ nome: '', email: '', cargo: '', departamento: '', status: 'ativo' });
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      alert('Erro ao salvar usuário');
    }
  };

  const handleModalDelete = async () => {
    if (!editingUser || !confirm('Deseja realmente excluir este usuário?')) {
      return;
    }

    try {
      await usuariosApi.delete(editingUser.id);
      await loadUsuarios();
      setIsModalOpen(false);
      setFormData({ nome: '', email: '', cargo: '', departamento: '', status: 'ativo' });
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      alert('Erro ao excluir usuário');
    }
  };

  return (
    <div className="p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Usuários</h1>
            <p className="text-muted-foreground mt-2">
              Gerencie os usuários do sistema
            </p>
          </div>
          <Button onClick={handleOpenModal}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Usuário
          </Button>
        </div>

        <div className="bg-card border rounded-lg p-6">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Carregando usuários...
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={usuarios}
              searchKey="nome"
              searchPlaceholder="Buscar por nome..."
              onRowClick={handleRowClick}
            />
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? 'Editar Usuário' : 'Novo Usuário'}
        onSave={handleSave}
        onDelete={editingUser ? handleModalDelete : undefined}
        saveText="Salvar"
        deleteText="Excluir"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              placeholder="Nome completo"
              value={formData.nome}
              onChange={(e) =>
                setFormData({ ...formData, nome: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@exemplo.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cargo">Cargo</Label>
            <Input
              id="cargo"
              placeholder="Ex: Desenvolvedor, Gerente"
              value={formData.cargo}
              onChange={(e) =>
                setFormData({ ...formData, cargo: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="departamento">Departamento</Label>
            <Input
              id="departamento"
              placeholder="Ex: TI, RH, Financeiro"
              value={formData.departamento}
              onChange={(e) =>
                setFormData({ ...formData, departamento: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Usuarios;

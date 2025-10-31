import { useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/table';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';

interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha: string;
}

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([
    { id: 1, nome: 'João Silva', email: 'joao@email.com', senha: '123456' },
    { id: 2, nome: 'Maria Santos', email: 'maria@email.com', senha: '123456' },
    { id: 3, nome: 'Pedro Oliveira', email: 'pedro@email.com', senha: '123456' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
  });

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
  ];

  const handleOpenModal = () => {
    setEditingUser(null);
    setFormData({ nome: '', email: '', senha: '' });
    setIsModalOpen(true);
  };

  const handleRowClick = (usuario: Usuario) => {
    setEditingUser(usuario);
    setFormData({
      nome: usuario.nome,
      email: usuario.email,
      senha: usuario.senha,
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.nome || !formData.email || !formData.senha) {
      alert('Preencha todos os campos');
      return;
    }

    if (editingUser) {
      // Editar usuário existente
      setUsuarios(
        usuarios.map((u) =>
          u.id === editingUser.id
            ? { ...u, ...formData }
            : u
        )
      );
    } else {
      // Criar novo usuário
      const newUser: Usuario = {
        id: Math.max(...usuarios.map((u) => u.id), 0) + 1,
        ...formData,
      };
      setUsuarios([...usuarios, newUser]);
    }

    setIsModalOpen(false);
    setFormData({ nome: '', email: '', senha: '' });
  };

  const handleModalDelete = () => {
    if (editingUser && confirm('Deseja realmente excluir este usuário?')) {
      setUsuarios(usuarios.filter((u) => u.id !== editingUser.id));
      setIsModalOpen(false);
      setFormData({ nome: '', email: '', senha: '' });
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
          <DataTable
            columns={columns}
            data={usuarios}
            searchKey="nome"
            searchPlaceholder="Buscar por nome..."
            onRowClick={handleRowClick}
          />
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
            <Label htmlFor="senha">Senha</Label>
            <Input
              id="senha"
              type="password"
              placeholder="••••••••"
              value={formData.senha}
              onChange={(e) =>
                setFormData({ ...formData, senha: e.target.value })
              }
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Usuarios;

import { useSession } from 'next-auth/react';
import CreateCallingModal from 'pages/modals/create-calling-modal';
import FormTitle from 'pages/utilities/form-title';
import Layout from 'pages/utilities/layout';
import Spinner from 'pages/utilities/spinner';
import { useEffect, useState } from 'react';
import { IEditCalling } from 'utils/auth';
import { trpc } from 'utils/trpc';

export default function Callings() {
  //Obtenemos la sesión de la bd
  const { data: session } = useSession();
  const [editIsOpen, setEditIsOpen] = useState(false);
  const [rol, setRole] = useState('');
  //Hook de estado que controla la expansión de llave angular
  const [expandedStates, setExpandedStates] = useState<boolean[]>([]);
  //Hook de estado utilizado para recordar qué card acaba de seleccionar el usuario
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(
    null,
  );
  //Hook de estado que almacena el registro seleccionado
  const [selectedCalling, setSelectedCalling] = useState<IEditCalling | null>(
    null,
  );
  /**
   * Consultas a base de datos
   */
  //Obtener el usuario actual
  const { data: currentUser } = trpc.user.findOne.useQuery(
    session?.user?.id ?? '',
  );
  useEffect(() => {
    if (currentUser) {
      setRole(currentUser.role);
    } else {
      <Spinner text="Cargando" />;
    }
  }, [currentUser]);

  //Función de selección de registro y apertura de modal de edición
  const openEditModal = (calling: IEditCalling | null) => {
    setSelectedCalling(calling);
    setEditIsOpen(true);
  };
  //Función de cierre de modal de edición
  const closeEditModal = () => {
    setEditIsOpen(false);
  };

  return (
    <Layout>
      {/**
       * Botón para agregar nueva convocatoria
       * absolute bottom-0 right-0 h-16 w-16
       */}
      <div></div>
      <svg
        viewBox="0 0 512 512"
        className="fixed bottom-20 z-10 right-4 h-12 w-12 cursor-pointer rounded-lg fill-black drop-shadow-lg md:hidden md:bottom-6 md:w-auto"
        onClick={(event) => {
          event.stopPropagation();
          openEditModal(null);
        }}
      >
        <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344V280H168c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H280v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
      </svg>

      <div className="flex flex-row justify-between">
        <FormTitle text="Convocatorias" />
        <div className="hidden md:rounded-lg md:border md:bg-black md:border-black md:px-2 md:items-center md:flex md:flex-row md:gap-1">
          <svg
            viewBox="0 0 448 512"
            className={`h-8 w-8 cursor-pointer fill-white p-1.5  `}
            onClick={(event) => {
              event.stopPropagation();
              openEditModal(null);
            }}
          >
            <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
          </svg>

          <p className="text-white text-sm cursor-pointer">Agregar</p>
        </div>
      </div>
      <div className="cursor-pointer flex flex-col gap-2 p-6 rounded-lg shadow-custom-blue bg-white">
        <h3 className="text-black text-sm font-medium">
          Requiere: Personal de seguridad
        </h3>
        <div className="w-full">
          <ul>
            <li className="text-gray-500 text-sm">
              Experiencia mínima: 2 años
            </li>
            <li className="text-gray-500 text-sm">Sueldo: s/.1800</li>
            <li className="text-gray-500 text-sm">
              Educación: Secundaria completa
            </li>
          </ul>
        </div>
      </div>
      {editIsOpen && (
        <CreateCallingModal
          isOpen={editIsOpen}
          onClose={closeEditModal}
          selectedCalling={selectedCalling}
        />
      )}
    </Layout>
  );
}

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import CreateDocumentModal from 'pages/modals/create-document-modal';
import FormTitle from 'pages/utilities/form-title';
import Layout from 'pages/utilities/layout';
import Spinner from 'pages/utilities/spinner';

import { useEffect, useState } from 'react';
import { trpc } from 'utils/trpc';

export default function Profile() {
  /**
   * Declaraciones de hooks de estado
   */
  //Hook de estado que controla la apertura del modal de creación de documentos
  const [isOpen, setIsOpen] = useState(false);
  const [userId, setUserId] = useState('');
  //Obtener el usuario actual
  const { data: session, status } = useSession();

  const [docType, setDoctype] = useState('');

  //Redireccion al usuario a Main
  useEffect(() => {
    if (status === 'unauthenticated') {
      // Aquí puedes mostrar un spinner o cualquier indicador de carga mientras se verifica el estado de autenticación
      return;
    }
    if (session) {
      setUserId(session?.user?.id!);
    }
  }, [status, session]);

  /**
   * Consultas a base de datos
   */
  //Obtener los registros de bd
  const { data, isLoading } = trpc.document.getUserDocuments.useQuery({
    userId: userId,
  });
  const { data: currentUser } = trpc.user.findOne.useQuery(userId);

  /**
   * Funciones de apertura y cierre de modales
   */
  //Función de apertura del modal DocumentModal
  const openModal = (opt: string) => {
    setIsOpen(true);
    setDoctype(opt);
  };
  //Función de cierre del modal DocumentModal
  const closeModal = () => {
    setIsOpen(false);
    setDoctype('');
  };

  const urlDoc = (doc: string, userId: string) => {
    let founded = data?.find((record) => record.key === doc);
    if (founded !== undefined) {
      return `https://pacificsecurity.s3.amazonaws.com/documents/${userId}/${founded?.key}`;
    } else {
      return null;
    }
  };

  return (
    <>
      <Layout>
        <FormTitle text="Perfil" />
        <div className="flex flex-col gap-4 w-full h-full">
          {/*Foto y datos personales*/}
          <div className="flex flex-col items-center py-4 ">
            <Image
              className="rounded-full"
              src={currentUser?.image || ''}
              width={95}
              height={100}
              alt="Logo"
            />
            <p className="text-m text-base font-medium text-gray-700">
              {currentUser?.name}
            </p>
            <div className="flex flex-row gap-2 items-center">
              <p className="text-sm font-normal text-gray-500">
                {currentUser?.email}
              </p>
              {/**Este es el botón de edición */}
              <svg
                viewBox="0 0 512 512"
                className="h-4 w-4 cursor-pointer fill-sky-500"
              >
                <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z" />
              </svg>
            </div>
          </div>
          <div className="py-4 border-b border-gray-200">
            <h3 className="text-black text-sm font-medium">Datos personales</h3>
            <ul className="list-disc pl-5">
              <li className="text-gray-500 text-sm">
                Nombres: {currentUser?.name}
              </li>
              <li className="text-gray-500 text-sm">
                Apellidos: {currentUser?.lastName}
              </li>
            </ul>
          </div>

          <h3 className="text-black text-sm font-medium">Expediente</h3>
          <div className="h-full w-full overflow-x-auto pb-12 md:pb-0">
            <table className="h-full w-full">
              <thead className="border-b border-gray-200 text-left text-black text-sm font-light">
                <tr>
                  <th className="py-4 pr-2">Nro.</th>
                  <th className="py-4 pr-2">Documento</th>
                  <th className="py-4 pr-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200 text-sm font-light">
                  <td className="py-4 pr-2">1</td>
                  <td className="py-4 pr-2">DNI</td>
                  <td className="py-4 ">
                    <svg
                      viewBox="0 0 448 512"
                      className={`h-8 w-8 cursor-pointer fill-gray-500 p-1.5  `}
                      onClick={() => openModal('DNI')}
                    >
                      <path d="M246.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 109.3 192 320c0 17.7 14.3 32 32 32s32-14.3 32-32l0-210.7 73.4 73.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-128-128zM64 352c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-64z" />
                    </svg>
                  </td>

                  <td className="py-4">
                    <Link href={urlDoc('DNI', userId) ?? ''}>
                      <svg
                        viewBox="0 0 512 512"
                        className={`h-8 w-8 cursor-pointer  p-1.5 ${
                          urlDoc('DNI', userId) !== null
                            ? 'fill-pink-500'
                            : 'fill-gray-500'
                        }  `}
                      >
                        <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
                      </svg>
                    </Link>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 text-sm font-light">
                  <td className="py-4 pr-2">2</td>
                  <td className="py-4 pr-2">Carné SUCAMEC</td>
                  <td className="py-4 ">
                    <svg
                      viewBox="0 0 448 512"
                      className={`h-8 w-8 cursor-pointer fill-gray-500 p-1.5  `}
                      onClick={() => openModal('Carné SUCAMEC')}
                    >
                      <path d="M246.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 109.3 192 320c0 17.7 14.3 32 32 32s32-14.3 32-32l0-210.7 73.4 73.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-128-128zM64 352c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-64z" />
                    </svg>
                  </td>
                  <td className="py-4">
                    <Link href={urlDoc('Carné SUCAMEC', userId) ?? ''}>
                      <svg
                        viewBox="0 0 512 512"
                        className={`h-8 w-8 cursor-pointer  p-1.5 ${
                          urlDoc('Carné SUCAMEC', userId) !== null
                            ? 'fill-pink-500'
                            : 'fill-gray-500'
                        }  `}
                      >
                        <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
                      </svg>
                    </Link>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 text-sm font-light">
                  <td className="py-4 pr-2">3</td>

                  <td className="py-4 pr-2">Licencia para portar armas</td>
                  <td className="py-4 ">
                    <svg
                      viewBox="0 0 448 512"
                      className={`h-8 w-8 cursor-pointer fill-gray-500 p-1.5  `}
                      onClick={() => openModal('Licencia para portar armas')}
                    >
                      <path d="M246.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 109.3 192 320c0 17.7 14.3 32 32 32s32-14.3 32-32l0-210.7 73.4 73.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-128-128zM64 352c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-64z" />
                    </svg>
                  </td>
                  <td className="py-4">
                    <Link
                      href={urlDoc('Licencia para portar armas', userId) ?? ''}
                    >
                      <svg
                        viewBox="0 0 512 512"
                        className={`h-8 w-8 cursor-pointer  p-1.5 ${
                          urlDoc('Licencia para portar armas', userId) !== null
                            ? 'fill-pink-500'
                            : 'fill-gray-500'
                        }  `}
                      >
                        <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
                      </svg>
                    </Link>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 text-sm font-light">
                  <td className="py-4 pr-2">4</td>
                  <td className="py-4 pr-2">
                    Antecedentes (penales, policiales y judiciales) o
                    Certificado único laboral
                  </td>
                  <td className="py-4 ">
                    <svg
                      viewBox="0 0 448 512"
                      className={`h-8 w-8 cursor-pointer fill-gray-500 p-1.5  `}
                      onClick={() =>
                        openModal('Antecedentes o Certificado único laboral')
                      }
                    >
                      <path d="M246.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 109.3 192 320c0 17.7 14.3 32 32 32s32-14.3 32-32l0-210.7 73.4 73.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-128-128zM64 352c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-64z" />
                    </svg>
                  </td>
                  <td className="py-4">
                    <Link
                      href={
                        urlDoc(
                          'Antecedentes o Certificado único laboral',
                          userId,
                        ) ?? ''
                      }
                    >
                      <svg
                        viewBox="0 0 512 512"
                        className={`h-8 w-8 cursor-pointer  p-1.5 ${
                          urlDoc(
                            'Antecedentes o Certificado único laboral',
                            userId,
                          ) !== null
                            ? 'fill-pink-500'
                            : 'fill-gray-500'
                        }  `}
                      >
                        <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
                      </svg>
                    </Link>
                  </td>
                </tr>

                <tr className="border-b border-gray-200 text-sm font-light">
                  <td className="py-4 pr-2">5</td>
                  <td className="py-4 pr-2">
                    Certificado físico y psicológico
                  </td>
                  <td className="py-4 ">
                    <svg
                      viewBox="0 0 448 512"
                      className={`h-8 w-8 cursor-pointer fill-gray-500 p-1.5`}
                      onClick={() =>
                        openModal('Certificado físico y psicológico')
                      }
                    >
                      <path d="M246.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 109.3 192 320c0 17.7 14.3 32 32 32s32-14.3 32-32l0-210.7 73.4 73.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-128-128zM64 352c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-64z" />
                    </svg>
                  </td>
                  <td className="py-4">
                    <Link
                      href={
                        urlDoc('Certificado físico y psicológico', userId) ?? ''
                      }
                    >
                      <svg
                        viewBox="0 0 512 512"
                        className={`h-8 w-8 cursor-pointer  p-1.5 ${
                          urlDoc('Certificado físico y psicológico', userId) !==
                          null
                            ? 'fill-pink-500'
                            : 'fill-gray-500'
                        }  `}
                      >
                        <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
                      </svg>
                    </Link>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 text-sm font-light">
                  <td className="py-4 pr-2">6</td>
                  <td className="py-4 pr-2">Certificado de estudios</td>
                  <td className="py-4 ">
                    <svg
                      viewBox="0 0 448 512"
                      className={`h-8 w-8 cursor-pointer fill-gray-500 p-1.5`}
                      onClick={() => openModal('Certificado de estudios')}
                    >
                      <path d="M246.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 109.3 192 320c0 17.7 14.3 32 32 32s32-14.3 32-32l0-210.7 73.4 73.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-128-128zM64 352c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-64z" />
                    </svg>
                  </td>
                  <td className="py-4">
                    <Link
                      href={urlDoc('Certificado de estudios', userId) ?? ''}
                    >
                      <svg
                        viewBox="0 0 512 512"
                        className={`h-8 w-8 cursor-pointer  p-1.5 ${
                          urlDoc('Certificado de estudios', userId) !== null
                            ? 'fill-pink-500'
                            : 'fill-gray-500'
                        }  `}
                      >
                        <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
                      </svg>
                    </Link>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 text-sm font-light">
                  <td className="py-4 pr-2">7</td>
                  <td className="py-4 pr-2">Certificado laboral</td>
                  <td className="py-4 ">
                    <svg
                      viewBox="0 0 448 512"
                      className={`h-8 w-8 cursor-pointer fill-gray-500 p-1.5`}
                      onClick={() => openModal('Certificado laboral')}
                    >
                      <path d="M246.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 109.3 192 320c0 17.7 14.3 32 32 32s32-14.3 32-32l0-210.7 73.4 73.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-128-128zM64 352c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-64z" />
                    </svg>
                  </td>
                  <td className="py-4">
                    <Link href={urlDoc('Certificado laboral', userId) ?? ''}>
                      <svg
                        viewBox="0 0 512 512"
                        className={`h-8 w-8 cursor-pointer  p-1.5 ${
                          urlDoc('Certificado laboral', userId) !== null
                            ? 'fill-pink-500'
                            : 'fill-gray-500'
                        }  `}
                      >
                        <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
                      </svg>
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <CreateDocumentModal
          isOpen={isOpen}
          onClose={closeModal}
          opt={docType}
        />
      </Layout>
    </>
  );
}

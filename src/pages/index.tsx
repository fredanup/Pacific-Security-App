import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Spinner from './utilities/spinner';
import { trpc } from 'utils/trpc';

export default function Home() {
  //Obtenemos la sesión de la bd
  const { data: session, status } = useSession();
  /**
   * Consultas a base de datos
   */
  //Obtener al usuario actual
  const { data: currentUser } = trpc.user.findOne.useQuery(
    session?.user?.id ?? '',
  );

  //Inicialización de ruta
  const router = useRouter();

  //Redireccion al usuario a Main
  useEffect(() => {
    if (status === 'unauthenticated') {
      // Aquí puedes mostrar un spinner o cualquier indicador de carga mientras se verifica el estado de autenticación
      return;
    }
    if (session) {
      if (currentUser) {
        if (currentUser.role !== 'applicant') {
          // Si el usuario es un postulante redirigir al menú de postulantes
          router.replace('/dashboard/users').catch((error) => {
            // Manejar cualquier error que pueda ocurrir al redirigir
            console.error('Error al redirigir a la página principal:', error);
          });
        } else {
          // Si el usuario es un empleador redirigir al menú de postulantes
          router.replace('/dashboard/callings').catch((error) => {
            // Manejar cualquier error que pueda ocurrir al redirigir
            console.error('Error al redirigir a la página principal:', error);
          });
        }
      }
    }
  }, [status, session, router, currentUser]);

  return (
    <>
      {status === 'authenticated' || status === 'loading' ? (
        <Spinner text="Cargando" />
      ) : (
        <>
          <Image
            src={'/background.jpg'}
            layout="fill"
            objectFit="cover"
            alt="Background"
          />
          {/* Superposición oscura */}
          <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
          <div className="fixed inset-0 flex items-center justify-center z-30 flex-col">
            <Image
              className="absolute top-0 right-0 m-4 p-2"
              src={'/logo.png'}
              width={100}
              height={100}
              alt="Logo"
            />
            <div className="p-12">
              <div className="text-left mb-6">
                <h1 className="font-bold text-3xl text-white">PACIFIC</h1>
                <h1 className="font-bold text-3xl text-black text-outline-white">
                  SECURITY
                </h1>
                <h1 className="font-bold text-3xl text-white">INTERNATIONAL</h1>
              </div>

              <p className="text-white text-sm font-light text-justify">
                Con la finalidad de brindar un excelente servicio y estar más
                cerca de nuestros beneficiarios contamos con una red de oficinas
                en la macro region sur del Peru.
              </p>
            </div>

            <div
              onClick={() => {
                signIn('google').catch(console.log);
              }}
              className="cursor-pointer mt-12 w-64 rounded-full border bg-white px-4 py-2 text-lg font-normal text-black hover:text-white hover:bg-black hover:border-transparent flex flex-row gap-2 items-center justify-center"
            >
              <Image
                src={'/icons/google.png'}
                width={30}
                height={30}
                alt="Logo"
              />
              <label>Iniciar sesión</label>
            </div>
          </div>
        </>
      )}
    </>
  );
}

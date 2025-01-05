// import Sidebar from "@/components/Sidebar";
// import Image from "next/image";
// import MobileNav from "@/components/MobileNav";
// export default function RootLayout({
//     children,
//   }: Readonly<{
//     children: React.ReactNode;
//   }>) {
//     const logged_in = {
//       firstName: "Mirna",
//       lastName: "Ahmed",
//     };
//     return (
//       <main className="flex h-screen w-full font-inter">
//          <Sidebar user={logged_in} />
//          <div className='flex size-full flex-col'>
//           <div className='root-layout'>
//             <Image src="/icons/logo.svg" alt="Sky Logo" width={40} height={40} />
//             <div>
//               <MobileNav user={logged_in} />
//             </div>
//           </div>
//          </div>
//           {children}
//         </main>
//     );
//   }
import MobileNav from "@/components/MobileNav";
import Sidebar from "@/components/Sidebar";
// import { getLoggedInUser } from "@/lib/actions/user.actions";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const loggedIn = {firstName: "Mirna", lastName: "Ahmed"};

  if(!loggedIn) redirect('/sign-in')

  return (
    <main className="flex h-screen w-full font-inter">
      <Sidebar user={loggedIn} />

      <div className="flex size-full flex-col">
        <div className="root-layout">
          <Image src="/icons/logo.svg" width={30} height={30} alt="logo" />
          <div>
            <MobileNav user={loggedIn} />
          </div>
        </div>
        {children}
      </div>
    </main>
  );
}
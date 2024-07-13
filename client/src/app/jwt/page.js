"use client"
import { gql, useQuery } from "@apollo/client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const query = gql`
  query($data: UserInput!) {
    login(data: $data) {
      token
      name
      email
    }
  }
`;

export default function Jwt() {
  const { data: session } = useSession();
  const router = useRouter();
  const { data } = useQuery(query, {

    variables: {
      data: {
        name: session?.user?.name || '',
        email: session?.user?.email || '',
      },
    },
    skip: !session
  });


  useEffect(() => {
    if (data && data.login && data.login.token) {
      localStorage.setItem("auth-token", JSON.stringify(data.login.token));
      router.push('/')
    }
  }, [data]);


  return (
    <div>
      Wait redirecting...
    </div>
  );
}

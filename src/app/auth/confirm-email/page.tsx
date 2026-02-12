import Link from 'next/link';
import { Button } from '@/src/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';

type PageProps = {
  searchParams?: { email?: string | string[] };
};

export default function Page({ searchParams }: PageProps) {
  const emailParam = searchParams?.email;
  const email = Array.isArray(emailParam) ? emailParam[0] : emailParam;

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Check your email</CardTitle>
            <CardDescription>
              {email ? `We sent a confirmation link to ${email}.` : 'We sent a confirmation link.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Click the link in that email to confirm your account and finish signing up.
            </p>
            <Button asChild className="w-full">
              <Link href="/auth/login">Back to login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

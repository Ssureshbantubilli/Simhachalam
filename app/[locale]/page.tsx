import { setRequestLocale } from 'next-intl/server';
import HomePage from '../components/HomePage';

export default function Page({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  return <HomePage locale={locale} />;
}

export async function generateStaticParams() {
  return ['en', 'te', 'hi', 'or'].map((locale) => ({ locale }));
}

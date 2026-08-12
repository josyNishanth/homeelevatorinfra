import QuoteForm from '../components/QuoteForm';

/**
 * Dedicated quote route. The form carries its own heading and contact facts,
 * so this page needs no separate header band above it.
 */
export default function Quote() {
  return <QuoteForm />;
}

export default function Head() {
  return (
    <>
      <title>Mood Habit Tracker</title>
      <meta name="description" content="Track your mood and notes with ease." />

      {/* Open Graph */}
      <meta property="og:title" content="Mood Habit Tracker" />
      <meta property="og:description" content="Track your mood and notes with ease." />
      <meta property="og:image" content="https://mood-habit-tracker-gilt.vercel.app/thumbnail.png" />
      <meta property="og:url" content="https://mood-habit-tracker-gilt.vercel.app" />
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="My Awesome App" />
      <meta name="twitter:description" content="Track your mood and notes with ease." />
      <meta name="twitter:image" content="https://mood-habit-tracker-gilt.vercel.app/thumbnail.png" />
    </>
  )
}

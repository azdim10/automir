interface YandexMapEmbedProps {
  latitude: number
  longitude: number
  title: string
  zoom: number
}

function buildYandexMapSrc({
  latitude,
  longitude,
  zoom,
}: Pick<YandexMapEmbedProps, 'latitude' | 'longitude' | 'zoom'>) {
  const point = `${String(longitude)},${String(latitude)}`
  const params = new URLSearchParams({
    ll: point,
    pt: `${point},pm2rdm`,
    z: String(zoom),
  })

  return `https://yandex.ru/map-widget/v1/?${params.toString()}`
}

export function YandexMapEmbed({
  latitude,
  longitude,
  title,
  zoom,
}: YandexMapEmbedProps) {
  return (
    <iframe
      allowFullScreen
      className="h-[28rem] w-full rounded-2xl border border-slate-200"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      src={buildYandexMapSrc({ latitude, longitude, zoom })}
      title={title}
    />
  )
}

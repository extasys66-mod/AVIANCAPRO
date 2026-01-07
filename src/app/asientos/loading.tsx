export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="text-center">
        <img src="/loading.gif" alt="Cargando..." className="w-32 h-32 mx-auto" />
      </div>
    </div>
  )
}

export function buildSlots(agenda: any) {

  const horarios = [
    "09:00","09:30","10:00","10:30",
    "11:00","11:30","12:00","12:30",
    "13:00","13:30","14:00","14:30",
    "15:00","15:30","16:00","16:30",
    "17:00","17:30","18:00","18:30"
  ];

  const resultado: any = {};

  Object.keys(agenda || {}).forEach((prof) => {

    resultado[prof] = horarios.map((hora) => {

      const ocupado = agenda[prof].find(
        (a: any) => a.inicio === hora
      );

      if (ocupado) {
        return {
          hora,
          ocupado: true,
          cliente: ocupado.cliente
        };
      }

      return {
        hora,
        ocupado: false
      };

    });

  });

  return resultado;

}
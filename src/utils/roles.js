export const ROLES = {
  ADMIN: 'ADMIN',
  PROPIETARIO: 'PROPIETARIO',
  CAJERO: 'CAJERO'
}

export const puedeAcceder = (rol, modulo) => {
  const permisos = {
    dashboard:        [ROLES.ADMIN, ROLES.PROPIETARIO],
    pos:              [ROLES.ADMIN, ROLES.PROPIETARIO, ROLES.CAJERO],
    productos_ver:    [ROLES.ADMIN, ROLES.PROPIETARIO],        // ← quitamos CAJERO
    productos_editar: [ROLES.ADMIN, ROLES.PROPIETARIO],
    clientes:         [ROLES.ADMIN, ROLES.PROPIETARIO, ROLES.CAJERO],
    ventas_ver:       [ROLES.ADMIN, ROLES.PROPIETARIO, ROLES.CAJERO],
    ventas_cancelar:  [ROLES.ADMIN, ROLES.PROPIETARIO],
    abonos:           [ROLES.ADMIN, ROLES.PROPIETARIO, ROLES.CAJERO],
    reportes:         [ROLES.ADMIN, ROLES.PROPIETARIO],
    usuarios:         [ROLES.ADMIN],
  }

  return permisos[modulo]?.includes(rol) ?? false
}
/**
 * Repositorio LocalStorage para Propiedades
 * Adaptador Secundario - Persistencia en navegador
 */

import type { 
  Propiedad, 
  CrearPropiedadData, 
  ActualizarPropiedadData 
} from '~/src/domain/entities/Propiedad';

export class PropiedadLocalStorageRepository {
  private readonly STORAGE_KEY = 'albas_propiedades';

  constructor() {
    this.initializeStorage();
  }

  private initializeStorage(): void {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify([]));
    }
  }

  private getStorageData(): Propiedad[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) return [];
      
      const parsed = JSON.parse(data);
      // Convertir fechas de string a Date
      return parsed.map((item: any) => ({
        ...item,
        fechaCreacion: new Date(item.fechaCreacion),
        fechaActualizacion: item.fechaActualizacion ? new Date(item.fechaActualizacion) : null
      }));
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  }

  private saveStorageData(data: Propiedad[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      throw new Error('No se pudo guardar en el almacenamiento local');
    }
  }

  private getNextId(): number {
    const data = this.getStorageData();
    const maxId = data.reduce((max, item) => Math.max(max, item.id), 0);
    return maxId + 1;
  }

  async findAll(): Promise<Propiedad[]> {
    return this.getStorageData().filter(propiedad => propiedad.activo);
  }

  async findById(id: number): Promise<Propiedad | null> {
    const data = this.getStorageData();
    return data.find(propiedad => propiedad.id === id && propiedad.activo) || null;
  }

  async findByCodigo(codigo: string): Promise<Propiedad | null> {
    const data = this.getStorageData();
    return data.find(propiedad => 
      propiedad.codigo.toLowerCase() === codigo.toLowerCase() && 
      propiedad.activo
    ) || null;
  }

  async findByTipoPropiedad(tipoPropiedad: string): Promise<Propiedad[]> {
    const data = this.getStorageData();
    return data.filter(propiedad => 
      propiedad.tipoPropiedad === tipoPropiedad && 
      propiedad.activo
    );
  }

  async findByEstado(estado: string): Promise<Propiedad[]> {
    const data = this.getStorageData();
    return data.filter(propiedad => 
      propiedad.estado === estado && 
      propiedad.activo
    );
  }

  async findByCiudad(ciudad: string): Promise<Propiedad[]> {
    const data = this.getStorageData();
    return data.filter(propiedad => 
      propiedad.ciudad.toLowerCase() === ciudad.toLowerCase() && 
      propiedad.activo
    );
  }

  async findByUsuarioCreador(idUsuario: number): Promise<Propiedad[]> {
    const data = this.getStorageData();
    return data.filter(propiedad => 
      propiedad.idUsuarioCreador === idUsuario && 
      propiedad.activo
    );
  }

  async save(data: CrearPropiedadData): Promise<Propiedad> {
    const existingData = this.getStorageData();
    
    // Verificar si el código ya existe
    const existingByCodigo = existingData.find(p => 
      p.codigo.toLowerCase() === data.codigo.toLowerCase()
    );
    if (existingByCodigo) {
      throw new Error('Ya existe una propiedad con ese código');
    }

    const newPropiedad: Propiedad = {
      ...data,
      id: this.getNextId(),
      codigo: data.codigo.toUpperCase(),
      fechaCreacion: new Date(),
      fechaActualizacion: null,
      activo: true
    };

    existingData.push(newPropiedad);
    this.saveStorageData(existingData);

    return newPropiedad;
  }

  async update(id: number, data: ActualizarPropiedadData): Promise<Propiedad> {
    const existingData = this.getStorageData();
    const index = existingData.findIndex(propiedad => propiedad.id === id && propiedad.activo);
    
    if (index === -1) {
      throw new Error('Propiedad no encontrada');
    }

    const updatedPropiedad: Propiedad = {
      ...existingData[index],
      ...data,
      fechaActualizacion: new Date()
    };

    existingData[index] = updatedPropiedad;
    this.saveStorageData(existingData);

    return updatedPropiedad;
  }

  async delete(id: number): Promise<void> {
    const existingData = this.getStorageData();
    const index = existingData.findIndex(propiedad => propiedad.id === id && propiedad.activo);
    
    if (index === -1) {
      throw new Error('Propiedad no encontrada');
    }

    // Borrado lógico
    existingData[index].activo = false;
    existingData[index].fechaActualizacion = new Date();
    
    this.saveStorageData(existingData);
  }

  async search(term: string): Promise<Propiedad[]> {
    const data = this.getStorageData();
    const lowerTerm = term.toLowerCase();
    
    return data.filter(propiedad => 
      propiedad.activo && (
        propiedad.codigo.toLowerCase().includes(lowerTerm) ||
        propiedad.nombre.toLowerCase().includes(lowerTerm) ||
        propiedad.direccion.toLowerCase().includes(lowerTerm) ||
        propiedad.ciudad.toLowerCase().includes(lowerTerm) ||
        propiedad.descripcionDetallada?.toLowerCase().includes(lowerTerm)
      )
    );
  }

  async findDisponiblesParaVenta(): Promise<Propiedad[]> {
    const data = this.getStorageData();
    return data.filter(propiedad => 
      propiedad.activo && 
      propiedad.estado === 'Disponible' && 
      (propiedad.tipoOferta === 'Venta' || propiedad.tipoOferta === 'Venta_y_Alquiler') &&
      propiedad.precioVenta !== null
    );
  }

  async findDisponiblesParaAlquiler(): Promise<Propiedad[]> {
    const data = this.getStorageData();
    return data.filter(propiedad => 
      propiedad.activo && 
      propiedad.estado === 'Disponible' && 
      (propiedad.tipoOferta === 'Alquiler' || propiedad.tipoOferta === 'Venta_y_Alquiler') &&
      propiedad.precioAlquiler !== null
    );
  }

  async findByRangoPrecio(minPrecio?: number, maxPrecio?: number): Promise<Propiedad[]> {
    const data = this.getStorageData();
    
    return data.filter(propiedad => {
      if (!propiedad.activo) return false;
      
      const precio = propiedad.precioVenta || propiedad.precioAlquiler;
      if (!precio) return false;
      
      if (minPrecio !== undefined && precio < minPrecio) return false;
      if (maxPrecio !== undefined && precio > maxPrecio) return false;
      
      return true;
    });
  }

  async count(): Promise<number> {
    const data = this.getStorageData();
    return data.filter(propiedad => propiedad.activo).length;
  }

  async countByEstado(): Promise<Record<string, number>> {
    const data = this.getStorageData();
    const activas = data.filter(propiedad => propiedad.activo);
    
    const counts: Record<string, number> = {};
    activas.forEach(propiedad => {
      counts[propiedad.estado] = (counts[propiedad.estado] || 0) + 1;
    });
    
    return counts;
  }

  async clear(): Promise<void> {
    localStorage.removeItem(this.STORAGE_KEY);
    this.initializeStorage();
  }
}

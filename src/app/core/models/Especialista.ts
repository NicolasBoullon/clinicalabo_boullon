export interface Especialista{
    rol:string;
    nombre:string;
    apellido:string;
    edad:number;
    dni:number;
    especialidades:[];
    correo:string;
    imagen:string;
    aprobada:boolean;
    lunes:{
        dias:{especialidad:string,hora:string};
        horarios:Record<string,string>;
    }
    martes:{
        dias:{especialidad:string,hora:string};
        horarios:{desde:string,hasta:string}
    }
    miercoles:{
        dias:{especialidad:string,hora:string};
        horarios:{desde:string,hasta:string}

    }
    jueves:{
        dias:{especialidad:string,hora:string};
        horarios:{desde:string,hasta:string}

    }
    viernes:{
        dias:{especialidad:string,hora:string};
        horarios:{desde:string,hasta:string}

    }
    sabado:{
        dias:{especialidad:string,hora:string};
        horarios:{desde:string,hasta:string}
    }
}
function calcularCompatibilidade(usuario, evento) {
  let score = 0;
  let totalCriterios = 0;

  if (!usuario || !evento) return 0;

  // 1. Habilidades (40% do score)
  if (usuario.habilidades && evento.habilidades && evento.habilidades.length > 0) {
    const usuarioHabilidades = Array.isArray(usuario.habilidades) ? usuario.habilidades : [];
    const eventoHabilidades = Array.isArray(evento.habilidades) ? evento.habilidades : [];

    const intersection = usuarioHabilidades.filter(h => eventoHabilidades.includes(h));
    const percentualHabilidades = (intersection.length / eventoHabilidades.length) * 40;
    score += percentualHabilidades;
    totalCriterios += 40;
  }

  // 2. Localização (30% do score)
  if (usuario.cidade && evento.cidade) {
    score += usuario.cidade === evento.cidade ? 30 : 0;
    totalCriterios += 30;
  }

  // 3. Áreas de interesse (30% do score)
  if (usuario.areas_interesse && evento.categoria) {
    const areasInteresse = Array.isArray(usuario.areas_interesse) ? usuario.areas_interesse : [];
    score += areasInteresse.includes(evento.categoria) ? 30 : 0;
    totalCriterios += 30;
  }

  return totalCriterios > 0 ? Math.round(score / (totalCriterios / 100)) : 0;
}

module.exports = { calcularCompatibilidade };

import PropTypes from 'prop-types';
import { Dialog, 
    Box,
    Button,
    Card,
	Grid,
    Typography,
    CardHeader,
    CardContent } from '@mui/material';

export const ModalLGPD = (props) => {
  const { open, onClose, ...other } = props;
  
  const clickClose = (event) => {
    onClose();
  }

  return (
    <Dialog
      fullWidth
      maxWidth="md"
	  scroll='paper'
      onClose={onClose}
      open={open}
      {...other}
    >
        <Box sx={{ p: 1 }}>
            <Card {...other}>
                <CardHeader 
                    title={(
                    <Box
                        sx={{
                        alignItems: 'center',
                        display: 'flex',
                        justifyContent: 'space-between'
                        }}
                    >
                        <Typography
                            color="textPrimary"
                            variant="h6"
                        >
                        Contrato de tratamento e proteção de dados pessoais - LGPD
                        </Typography>
                    </Box>
                    )} />
                <CardContent>
					<Box sx={{ p: 2 }}>
						<div id="container">
							<h1>CONTRATO DE TRATAMENTO E PROTEÇÃO DE DADOS PESSOAIS – LEI GERAL DE PROTEÇÃO DE DADOS (LGPD)</h1>

							<p>
								Este contrato tem por finalidade estabelecer as condições sob as quais a <strong>DIDERE SOLUÇÕES E OTIMIZAÇÃO LTDA</strong>, na qualidade de CONTROLADORA, realizará o tratamento de dados pessoais fornecidos pelo TITULAR, pessoa natural ou jurídica usuária do aplicativo, de acordo com a Lei nº 13.709/2018 (Lei Geral de Proteção de Dados Pessoais - LGPD). Ambas as partes reconhecem a importância da privacidade e da segurança no tratamento dessas informações.
							</p>

							<h2>DEFINIÇÕES</h2>
							<p>Para os fins deste instrumento, aplicam-se as seguintes definições, conforme a LGPD:</p>
							<ul>
								<li><strong>Dado pessoal:</strong> informação relacionada a pessoa natural identificada ou identificável;</li>
								<li><strong>Dado pessoal sensível:</strong> dado sobre origem racial ou étnica, convicção religiosa, opinião política, saúde, vida sexual, dado genético ou biométrico;</li>
								<li><strong>Titular:</strong> pessoa natural (física) ou jurídica, quando aplicável ao contexto da prestação de serviços, a quem se referem os dados pessoais;</li>
								<li><strong>Controlador:</strong> pessoa natural ou jurídica responsável pelas decisões referentes ao tratamento dos dados pessoais;</li>
								<li><strong>Operador:</strong> pessoa natural ou jurídica que realiza o tratamento de dados pessoais em nome do controlador;</li>
								<li><strong>Encarregado (DPO):</strong> pessoa indicada pelo controlador para atuar como canal de comunicação com os titulares e a ANPD;</li>
								<li><strong>Tratamento:</strong> qualquer operação realizada com dados pessoais, como coleta, produção, recepção, classificação, utilização, acesso, reprodução, transmissão, distribuição, processamento, arquivamento, armazenamento, eliminação, avaliação ou controle da informação, modificação, comunicação, transferência, difusão ou extração.</li>
							</ul>

							<h2>1. OBJETO</h2>
							<p>
								1.1 O presente contrato tem como objeto a regulação do tratamento de dados pessoais e dados pessoais sensíveis fornecidos pelo TITULAR à CONTROLADORA, por ocasião da utilização dos serviços oferecidos pela plataforma digital DIDERE, compreendendo o aplicativo e os serviços associados, com estrita observância às disposições legais, princípios da boa-fé, transparência e segurança da informação.
							</p>

							<h2>2. DADOS COLETADOS E FINALIDADE</h2>
							<p>2.1 No escopo da prestação dos serviços, poderão ser coletados e tratados os seguintes dados pessoais e sensíveis:</p>
							<ul>
								<li>Nome e sobrenome;</li>
								<li>Idade e data de nascimento;</li>
								<li>Qualificação completa;</li>
								<li>Endereço residencial e eletrônico (e-mail);</li>
								<li>Endereço IP e localização geográfica; interesses e comportamento de navegação em websites; necessidades especiais ou condição de saúde relacionadas à acessibilidade;</li>
								<li>Histórico de serviços prestados com eventual envolvimento em saúde (ex: consultórios).</li>
							</ul>
							<p>2.2 O tratamento será restrito à necessidade e adequação à finalidade a que se propõem os serviços.</p>

							<h2>3. FINALIDADE DA COLETA</h2>
							<p>3.1 Os dados serão utilizados para:</p>
							<ul>
								<li>Identificação e autenticação segura dos usuários;</li>
								<li>Acesso aos espaços físicos da plataforma;</li>
								<li>Agendamento e uso de salas, consultórios e coworkings;</li>
								<li>Elaboração de estatísticas e melhorias nos serviços;</li>
								<li>Atendimento personalizado;</li>
								<li>Comunicação direta por e-mail, telefone ou notificações;</li>
								<li>Cumprimento de obrigações legais e contratuais.</li>
							</ul>

							<h2>4. GESTÃO, ARMAZENAMENTO E SEGURANÇA DOS DADOS</h2>
							<p>4.1 Os dados coletados serão armazenados em ambiente digital seguro, em servidores.</p>
							<p>4.2 CONTROLADORA empregará mecanismos de segurança da informação consistentes com os padrões mais elevados, tais como criptografia, autenticação de múltiplos fatores, políticas de acesso restrito, senhas com requisitos mínimos de robustez, treinamento periódico da equipe e registro de logs para auditoria e rastreabilidade.</p>

							<h2>5. DIREITOS DO TITULAR</h2>
							<p>
								5.1 Nos termos dos artigos 18 a 20 da LGPD, o TITULAR poderá, a qualquer tempo, exercer seus direitos, incluindo: acesso, correção, anonimização, exclusão, portabilidade, informação sobre compartilhamento e revogação de consentimento. Para tanto, poderá entrar em contato com a CONTROLADORA.
							</p>

							<h2>6. COMPARTILHAMENTO E TRANSFERÊNCIA DE DADOS</h2>
							<p>6.1 O tratamento dos dados poderá envolver o compartilhamento com parceiros técnicos e operacionais, desde que mediante contrato com cláusulas específicas de confidencialidade e conformidade com a LGPD.</p>
							<p>6.2 Em casos de aquisição, fusão, reorganização societária ou obrigação legal, o TITULAR será previamente comunicado.</p>
							<p>6.3 Em nenhuma hipótese os dados serão comercializados ou utilizados de maneira diversa da finalidade prevista neste contrato.</p>

							<h2>7. INCIDENTES DE SEGURANÇA</h2>
							<p>
								7.1 Em conformidade com o art. 48 da LGPD, caso ocorra qualquer incidente de segurança que comprometa os dados tratados, a CONTROLADORA compromete-se a informar a Autoridade Nacional de Proteção de Dados (ANPD) e os TITULARES afetados em prazo razoável, indicando as providências técnicas e administrativas adotadas para contenção e mitigação dos riscos.
							</p>

							<h2>8. CONFIDENCIALIDADE E OBRIGAÇÕES</h2>
							<p>
								8.1 Todas as informações acessadas pela CONTROLADORA durante a execução dos serviços serão tratadas como estritamente confidenciais, inclusive dados técnicos, comerciais, estratégicos, know-how, códigos-fonte, modelos, layouts, e documentos operacionais da CONTRATANTE.
							</p>
							<p>
								8.2 Tais informações não poderão ser divulgadas, copiadas, compartilhadas ou utilizadas para concorrência, nem mesmo após o término contratual, por um período de 1 (um) ano, sob pena de responsabilização civil.
							</p>
							<p>
								8.3 A CONTROLADORA reconhece que toda informação, material, produto ou resultado desenvolvido no âmbito deste contrato será de propriedade exclusiva da CONTRATANTE, não podendo ser utilizado para fins próprios ou de terceiros, salvo com autorização expressa e escrita.
							</p>
							<p>
								8.4 Em caso de término da relação, toda documentação confidencial deverá ser imediatamente devolvida.
							</p>

							<h2>9. RESPONSABILIDADES APÓS O CONTRATO</h2>
							<p>
								9.1 Mesmo após a rescisão contratual, a CONTROLADORA se compromete a manter sigilo e confidencialidade quanto aos dados e informações acessados, abstendo-se de utilizar quaisquer dados para contatar clientes da CONTRATANTE, direta ou indiretamente, por si ou por terceiros.
							</p>
							<p>
								9.2 Tal obrigação vincula apenas sócios e representantes legais da CONTROLADORA.
							</p>

							<h2>10. DISPOSIÇÕES FINAIS SOBRE PROTEÇÃO DE DADOS</h2>
							<p>
								10.1 As partes declaram que adotam medidas para proteger a liberdade, privacidade e livre desenvolvimento da personalidade dos TITULARES, nos termos da LGPD.
							</p>
							<p>
								10.2 Toda coleta e tratamento observará base legal adequada, finalidade legítima e será limitado ao necessário para execução do contrato, sendo vedado o uso ou retenção indevida após o fim do vínculo contratual.
							</p>

							<h2>11. FORO</h2>
							<p>
								11.1 Para dirimir quaisquer dúvidas ou controvérsias decorrentes do presente instrumento, fica eleito o foro da comarca de Vitória/ES, renunciando-se expressamente a qualquer outro, por mais privilegiado que seja.
							</p>

							<p>
								E por estarem assim justas e contratadas, firmam o presente contrato em meio eletrônico, nos termos da legislação vigente.
							</p>

							<p>
								<strong>DIDERE SOLUÇÕES E OTIMIZAÇÃO LTDA</strong><br/>
								CNPJ nº 58.248.227/0001-30
							</p>
							<p>
								<strong>CONTRATANTE</strong>
							</p>
						</div>
					</Box>
                </CardContent>
				<Box
                    sx={{
                    alignItems: 'center',
                    display: 'flex',
                    flexWrap: 'wrap',
                    m: -1,
                    p: 2
                    }}
                >
                    <Grid 
                        container
                        spacing={3}
                    >
                        <Grid item
                            md={12}
                            xs={12}
                        >
                            <Button 
                                color="primary"
                                type="button"
                                variant="contained"
                                onClick={clickClose}
                            >
                                Fechar
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Card>
        </Box>
    </Dialog>
  );
};

ModalLGPD.propTypes = {
	open: PropTypes.bool,
	onClose: PropTypes.func
};

ModalLGPD.defaultProps = {
  open: false
};
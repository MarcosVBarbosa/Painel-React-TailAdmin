import { CardBasicProps } from "../../../interface";

const CardBasic = ({
  headerContent,
  bodyContent,
  footerContent,
  onClose,
  className = "",
}: CardBasicProps) => {
  return (
    <div
      className={`flex flex-col w-full max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900 ${className}`}
    >
      {/* Cabeçalho Fixo */}
      {headerContent && (
        <div className="relative shrink-0 border-b border-gray-100 bg-gray-50/30 px-6 py-5 dark:border-gray-800 dark:bg-white/[0.02]">
          <div className="flex items-start justify-between">
            <div className="flex-1">{headerContent}</div>
            {onClose && (
              <button
                onClick={onClose}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <span className="text-xl leading-none">&times;</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Corpo com Scroll Interno */}
      {bodyContent && (
        <div className="flex-1 overflow-y-auto px-6 py-6 lg:px-8 custom-scrollbar">
          {bodyContent}
        </div>
      )}

      {/* Rodapé Fixo */}
      {footerContent && (
        <div className="shrink-0 flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-5 dark:border-gray-800 bg-white dark:bg-gray-900">
          {footerContent}
        </div>
      )}
    </div>
  );
};

export default CardBasic;

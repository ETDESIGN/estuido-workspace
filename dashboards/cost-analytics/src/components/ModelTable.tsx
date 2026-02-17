import { models } from '../data';
import { Star } from 'lucide-react';

const tierLabels = {
  pulse: { label: 'PULSE', subtitle: 'Routine Tasks', bg: 'bg-green-500/20 text-green-400' },
  workhorse: { label: 'WORKHORSE', subtitle: 'Moderate Complexity', bg: 'bg-amber-500/20 text-amber-400' },
  brain: { label: 'BRAIN', subtitle: 'Complex Reasoning', bg: 'bg-fuchsia-500/20 text-fuchsia-400' },
};

export function ModelTable() {
  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm">
      <h3 className="mb-6 text-lg font-semibold text-white">Available Models</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="pb-3 text-left text-sm font-medium text-gray-400">Model</th>
              <th className="pb-3 text-left text-sm font-medium text-gray-400">Tier</th>
              <th className="pb-3 text-right text-sm font-medium text-gray-400">Input Cost</th>
              <th className="pb-3 text-right text-sm font-medium text-gray-400">Output Cost</th>
              <th className="pb-3 text-right text-sm font-medium text-gray-400">Context</th>
              <th className="pb-3 text-center text-sm font-medium text-gray-400">Default</th>
            </tr>
          </thead>
          <tbody>
            {models.map((model) => {
              const tier = tierLabels[model.tier];
              return (
                <tr key={model.id} className="border-b border-gray-800/50 last:border-0 hover:bg-gray-800/30">
                  <td className="py-4">
                    <div>
                      <p className="font-medium text-white">{model.name}</p>
                      <p className="text-sm text-gray-500">{model.provider}</p>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex flex-col gap-1">
                      <span className={`inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${tier.bg}`}>
                        {tier.label}
                      </span>
                      <span className="text-xs text-gray-500">{tier.subtitle}</span>
                    </div>
                  </td>
                  <td className="py-4 text-right">
                    <span className="text-gray-300">
                      {model.inputCost === 0 ? 'Free' : `$${model.inputCost.toFixed(2)}/M`}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <span className="text-gray-300">
                      {model.outputCost === 0 ? 'Free' : `$${model.outputCost.toFixed(2)}/M`}
                    </span>
                  </td>
                  <td className="py-4 text-right text-gray-300">
                    {(model.contextWindow / 1000).toFixed(0)}K
                  </td>
                  <td className="py-4 text-center">
                    {model.isDefault && (
                      <span className="inline-flex items-center justify-center rounded-full bg-fuchsia-500/20 p-1">
                        <Star className="h-4 w-4 text-fuchsia-400" />
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

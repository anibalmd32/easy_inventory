'use client';
import * as ShadCard from '@/components/ui/card';
import NumberTicker from '@/components/magicui/number-ticker';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { EntityCountItem, TRENDING } from '@/definitions';
import { useDolarStore } from '@/store/dolarStore';

interface CountCardProps {
  item: EntityCountItem;
}

export const CountCard = ({ item }: CountCardProps) => {
  const { icon: Icon, percentage, title, totalCount, isCash } = item;
  const { price } = useDolarStore();

  return (
    <ShadCard.Card className="bg-gray-900 text-gray-200">
      <ShadCard.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <ShadCard.CardTitle className="text-sm font-medium">
          {title}
        </ShadCard.CardTitle>
        <Icon className="h-4 w-4 text-muted" />
      </ShadCard.CardHeader>
      {totalCount === 0 ? (
        <p className="text-center text-sm p-6">Sin datos</p>
      ) : (
        <ShadCard.CardContent className="space-y-2">
          <div className="text-2xl font-bold">
            {isCash && '$'}
            <NumberTicker className="text-gray-100" value={totalCount} />{' '}
            {isCash && price && (
              <span>
                (Bs.{' '}
                <NumberTicker
                  className="text-gray-100"
                  value={totalCount * price}
                />
                )
              </span>
            )}
          </div>
          <p
            className="text-xs text-muted flex items-center gap-2 font-medium leading-none"
            title="+20.1% desde el ultimo mes"
          >
            {percentage.tendency === TRENDING.UP ? '+' : '-'}
            {percentage.rate}%
            {percentage.tendency === TRENDING.UP ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
          </p>
        </ShadCard.CardContent>
      )}
    </ShadCard.Card>
  );
};

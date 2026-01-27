import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingBag, Rocket, Sparkles } from 'lucide-react';

export default function MarketplacePage() {
	return (
		<div className="min-h-screen bg-background text-foreground flex flex-col">
			<Header />

			<main className="flex-1 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
				{/* Abstract Background Elements */}
				<div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-primary/20 blur-[100px]" />
				<div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-blue-500/20 blur-[100px]" />

				<div className="relative z-10 max-w-2xl mx-auto space-y-8 p-8 rounded-2xl border border-white/10 bg-black/20 backdrop-blur-sm">
					<div className="flex justify-center">
						<div className="relative">
							<div className="absolute -inset-1 rounded-full bg-linear-to-r from-primary to-purple-600 blur opacity-75 animate-pulse" />
							<div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-card border border-border">
								<ShoppingBag className="h-10 w-10 text-primary" />
							</div>
							<div className="absolute -bottom-2 -right-2 bg-background rounded-full p-1.5 border border-border">
								<Sparkles className="h-4 w-4 text-yellow-500" />
							</div>
						</div>
					</div>

					<div className="space-y-4">
						<h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-linear-to-r from-white to-white/60 bg-clip-text text-transparent">
							Marketplace Coming Soon
						</h1>
						<p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
							We're building the ultimate destination for AI movie merchandise,
							NFTs, and exclusive creator content. Get ready to own a piece of
							the future.
						</p>
					</div>

					<div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto pt-4">
						<Input
							type="email"
							placeholder="Enter your email for updates"
							className="bg-background/50 border-white/10 h-10"
						/>
						<Button className="h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-8 transition-all hover:scale-105">
							<Rocket className="mr-2 h-4 w-4" />
							Notify Me
						</Button>
					</div>

					<div className="pt-8 grid grid-cols-3 gap-4 text-sm text-muted-foreground border-t border-white/5">
						<div className="flex flex-col items-center gap-1">
							<span className="font-semibold text-foreground">Exclusive</span>
							<span>Merchandise</span>
						</div>
						<div className="flex flex-col items-center gap-1">
							<span className="font-semibold text-foreground">Digital</span>
							<span>Collectibles</span>
						</div>
						<div className="flex flex-col items-center gap-1">
							<span className="font-semibold text-foreground">Direct</span>
							<span>Support</span>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
